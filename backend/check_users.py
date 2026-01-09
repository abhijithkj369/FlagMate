from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Create tables if they don't exist (just to be safe, though main.py does this)
models.Base.metadata.create_all(bind=engine)

def get_users():
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}")
    finally:
        db.close()

if __name__ == "__main__":
    get_users()
