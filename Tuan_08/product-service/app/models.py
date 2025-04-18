from sqlalchemy import Column, Integer, String, Float, Text
from pydantic import BaseModel
from .database import Base

# SQLAlchemy model
class ProductDB(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    description = Column(Text, nullable=True)
    stock = Column(Integer)

# Pydantic models for API
class ProductBase(BaseModel):
    name: str
    price: float
    description: str | None = None
    stock: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True
