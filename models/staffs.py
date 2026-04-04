from sqlalchemy import Column, Integer, String, DateTime
from database import Base


class Staff(Base):
    __tablename__ = "staffs"

    id = Column(Integer, primary_key=True)
    staff_id = Column(String(20), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    position = Column(String(100), nullable=False)
    responsibility = Column(String(255), nullable=False)
    school_affiliation = Column(String(150), nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="staff")
    last_login = Column(DateTime, nullable=True)
