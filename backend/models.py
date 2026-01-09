from sqlalchemy import Column, Integer, String, ForeignKey, Date, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    profile_pic = Column(String, nullable=True)
    partner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    link_code = Column(String, unique=True, index=True, nullable=True)

    partner = relationship("User", remote_side=[id], post_update=True)
    logs = relationship("DailyLog", back_populates="user")

class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(Integer, primary_key=True, index=True)
    user1_id = Column(Integer, ForeignKey("users.id"))
    user2_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(DateTime(timezone=True), server_default=func.now())

class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, index=True)
    green_flags = Column(JSON, default=list)
    red_flags = Column(JSON, default=list)
    mood = Column(Integer, default=5) # 1-10 scale
    score = Column(Integer, default=0)

    user = relationship("User", back_populates="logs")

class LoveNote(Base):
    __tablename__ = "love_notes"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Integer, default=0) # 0=Unread, 1=Read

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
