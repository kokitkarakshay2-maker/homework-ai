from sqlalchemy import Column, String, DateTime, JSON, Text, Integer, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class AppSettings(Base):
    __tablename__ = "app_settings"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    device_id = Column(String, unique=True, index=True, nullable=False)
    language = Column(String, default="en")
    theme = Column(String, default="dark")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class HomeworkHistory(Base):
    __tablename__ = "homework_history"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    device_id = Column(String, index=True, nullable=True) # Initially single household, but future proofing
    future_user_id = Column(String, index=True, nullable=True) # For when auth is added
    
    filename = Column(String, nullable=False)
    subject = Column(String, index=True, nullable=True)
    worksheet_title = Column(String, index=True, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    
    question_count = Column(Integer, default=0)
    image_width = Column(Integer, nullable=True)
    image_height = Column(Integer, nullable=True)
    processing_time_ms = Column(Integer, nullable=True)
    
    status = Column(String, index=True, default="processing") # processing, completed, failed
    gemini_model = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True, index=True) # Soft delete
    
    # Relationships
    questions = relationship("WorksheetQuestion", back_populates="history", cascade="all, delete-orphan")


class WorksheetQuestion(Base):
    __tablename__ = "worksheet_questions"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    history_id = Column(String, ForeignKey("homework_history.id", ondelete="CASCADE"), index=True)
    
    question_number = Column(Integer, nullable=False)
    question_type = Column(String, nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    write_this = Column(Text, nullable=True)
    explanation = Column(JSON, nullable=True)
    color = Column(String, nullable=True)
    shape = Column(String, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    history = relationship("HomeworkHistory", back_populates="questions")
