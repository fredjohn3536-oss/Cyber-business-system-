from sqlalchemy import (
    Column, ForeignKey, Integer, String, Float, DateTime, Enum, Text, Boolean, DECIMAL
)
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
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    users = relationship("User", back_populates="business")
    categories = relationship("Category", back_populates="business")
    products = relationship("Product", back_populates="business")
    sales = relationship("Sale", back_populates="business")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    full_name = Column(String(150), nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(150), unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('super_admin', 'admin', 'manager', 'seller'), nullable=False, default='seller')
    status = Column(Enum('active', 'inactive'), default='active')
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    business = relationship("Business", back_populates="users")
    stock_movements = relationship("StockMovement", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    business = relationship("Business", back_populates="categories")
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    product_code = Column(String(50), unique=True, nullable=True)
    barcode = Column(String(100), unique=True, nullable=True)
    product_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    buying_price = Column(DECIMAL(15, 2), nullable=False, default=0.00)
    selling_price = Column(DECIMAL(15, 2), nullable=False, default=0.00)
    stock_quantity = Column(Integer, nullable=False, default=0)
    minimum_stock = Column(Integer, nullable=False, default=5)
    image_url = Column(Text, nullable=True)
    status = Column(Enum('active', 'inactive'), default='active')
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    business = relationship("Business", back_populates="products")
    category = relationship("Category", back_populates="products")
    sale_items = relationship("SaleItem", back_populates="product")
    stock_movements = relationship("StockMovement", back_populates="product")


class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receipt_number = Column(String(100), unique=True, nullable=False)
    total_amount = Column(DECIMAL(15, 2), nullable=False, default=0.00)
    total_profit = Column(DECIMAL(15, 2), nullable=False, default=0.00)
    payment_method = Column(Enum('cash', 'card', 'mobile_money', 'bank_transfer'), nullable=False, default='cash')
    notes = Column(Text, nullable=True)
    sale_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    business = relationship("Business", back_populates="sales")
    seller = relationship("User")
    items = relationship("SaleItem", back_populates="sale")
    receipt = relationship("Receipt", back_populates="sale", uselist=False)


class SaleItem(Base):
    __tablename__ = "sale_items"
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    buying_price = Column(DECIMAL(15, 2), nullable=False)
    selling_price = Column(DECIMAL(15, 2), nullable=False)
    total_amount = Column(DECIMAL(15, 2), nullable=False)
    profit = Column(DECIMAL(15, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    sale = relationship("Sale", back_populates="items")
    product = relationship("Product", back_populates="sale_items")


class StockMovement(Base):
    __tablename__ = "stock_movements"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    movement_type = Column(Enum('purchase', 'sale', 'return', 'adjustment', 'damaged', 'expired'), nullable=False)
    quantity = Column(Integer, nullable=False)
    previous_stock = Column(Integer, nullable=False)
    new_stock = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    product = relationship("Product", back_populates="stock_movements")
    user = relationship("User", back_populates="stock_movements")


class Receipt(Base):
    __tablename__ = "receipts"
    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False)
    receipt_number = Column(String(100), unique=True, nullable=False)
    pdf_url = Column(Text, nullable=True)
    printed = Column(Boolean, default=False)
    printed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    sale = relationship("Sale", back_populates="receipt")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    module = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    ip_address = Column(String(100), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="audit_logs")
