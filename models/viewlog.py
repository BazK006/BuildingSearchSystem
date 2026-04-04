from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime


class ViewLog(Base): 
    __tablename__ = "view_logs"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    viewed_at = Column(DateTime, default=datetime.datetime.now)
    ip_address = Column(String(45))
    user_agent = Column(String(255))
