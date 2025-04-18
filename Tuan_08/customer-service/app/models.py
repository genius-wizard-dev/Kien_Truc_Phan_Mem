from sqlalchemy import Column, Integer, String, Text
from pydantic import BaseModel, EmailStr
from typing import Optional
from .database import Base

# SQLAlchemy model
class CustomerDB(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    address = Column(Text)

# Pydantic models for API
class CustomerBase(BaseModel):
    name: str
    email: str
    phone: str
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True
