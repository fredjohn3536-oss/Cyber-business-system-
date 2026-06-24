from sqlalchemy import Column, ForeignKey, Integer, String, Float, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Business(Base):
    __tablename__ = "businesses"
    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(150), nullable=False)
    logo_url = Column(Text, nullable=True)
    phone = Column(String(30))
    email = Column(String(150))
    address = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    full_name = Column(String(150), nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(150), unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('super_admin', 'admin', 'manager', 'seller'), default='seller')
    status = Column(Enum('active', 'inactive'), default='active')
    created_at = Column(DateTime, server_default=func.now())
    
    business = relationship("Business")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    product_name = Column(String(200), nullable=False)
    buying_price = Column(Float, default=0.0)
    selling_price = Column(Float, default=0.0)
    stock_quantity = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

# You can add other models from db_schema.sql later
