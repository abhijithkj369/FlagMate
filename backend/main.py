from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, auth, database
from database import engine
from datetime import timedelta
import random
import string

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FlagMate API")

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to FlagMate API"}

# Auth Endpoints
@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    
    # Generate a simple link code
    link_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        link_code=link_code
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

from fastapi.security import OAuth2PasswordRequestForm

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/link-partner")
def link_partner(link_data: schemas.LinkPartner, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    if current_user.partner_id:
        raise HTTPException(status_code=400, detail="Already linked to a partner")
    
    partner = db.query(models.User).filter(models.User.link_code == link_data.link_code).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Invalid link code")
    if partner.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot link to yourself")
    
    current_user.partner_id = partner.id
    partner.partner_id = current_user.id # Bidirectional link
    db.commit()
    return {"message": "Partner linked successfully"}

@app.post("/logs", response_model=schemas.LogResponse)
def create_log(log: schemas.LogCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    # Calculate score: Green (+1) - Red (-1)
    score = len(log.green_flags) - len(log.red_flags)
    
    db_log = models.DailyLog(
        user_id=current_user.id,
        date=log.date,
        green_flags=log.green_flags,
        red_flags=log.red_flags,
        mood=log.mood,
        score=score
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@app.get("/logs", response_model=list[schemas.LogResponse])
def get_logs(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.DailyLog).filter(models.DailyLog.user_id == current_user.id).all()

@app.get("/recommendations")
def get_recommendations(query: str):
    # Mock recommendations
    common_flags = [
        "Made coffee", "Did the dishes", "Bought flowers", "Listened well", 
        "Left towel on floor", "Forgot date", "Interrupted", "Cooked dinner"
    ]
    return [f for f in common_flags if query.lower() in f.lower()]

@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    if not current_user.partner_id:
        raise HTTPException(status_code=400, detail="You must be linked to a partner to send notes")
    
    db_note = models.LoveNote(
        sender_id=current_user.id,
        receiver_id=current_user.partner_id,
        content=note.content
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/notes", response_model=list[schemas.NoteResponse])
def get_notes(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    # Get notes sent TO the current user
    return db.query(models.LoveNote).filter(models.LoveNote.receiver_id == current_user.id).order_by(models.LoveNote.created_at.desc()).all()

