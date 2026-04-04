from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    student_id = Column(String(20), unique=True, nullable=True)
    full_name = Column(String(100), nullable=False)
    grade_level = Column(String(10), nullable=True)
    room = Column(String(10), nullable=True)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="student")
    last_login = Column(DateTime, nullable=True)
