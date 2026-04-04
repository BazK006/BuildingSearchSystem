from sqlalchemy import Column, Integer, String, DateTime
from database import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True)
    teacher_id = Column(String(20), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    phone_number = Column(String(20), nullable=True)
    department = Column(String(100), nullable=False)  # หมวดวิชาที่สอน
    school_affiliation = Column(String(150), nullable=False)  # สังกัดโรงเรียน

    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="teacher")
    last_login = Column(DateTime, nullable=True)
