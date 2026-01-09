from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    avatar_url: Optional[str] = None
    theme_color: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    profile_pic: Optional[str] = None
    avatar_url: Optional[str] = None
    theme_color: Optional[str] = None
    partner_id: Optional[int] = None
    link_code: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LogCreate(BaseModel):
    date: date
    green_flags: List[str]
    red_flags: List[str]
    mood: int

class LogResponse(LogCreate):
    id: int
    score: int
    user_id: int

    class Config:
        from_attributes = True

class LinkPartner(BaseModel):
    link_code: str

class NoteCreate(BaseModel):
    content: str

class NoteResponse(NoteCreate):
    id: int
    sender_id: int
    receiver_id: int
    created_at: datetime
    is_read: int

    class Config:
        from_attributes = True
