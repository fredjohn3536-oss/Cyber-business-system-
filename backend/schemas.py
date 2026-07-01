from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, EmailStr


class BusinessCreate(BaseModel):
    business_name: str
    logo_url: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class BusinessUpdate(BaseModel):
    business_name: Optional[str] = None
    logo_url: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class BusinessOut(BusinessCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    business_id: Optional[int] = None
    business_name: Optional[str] = None
    full_name: str
    username: str
    email: Optional[str] = None
    password: str
    role: str = 'seller'


class UserOut(BaseModel):
    id: int
    business_id: int
    full_name: str
    username: str
    email: Optional[str] = None
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginRequest(BaseModel):
    username: str
    password: str


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryOut(CategoryCreate):
    id: int
    business_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ProductCreate(BaseModel):
    category_id: Optional[int] = None
    product_code: Optional[str] = None
    barcode: Optional[str] = None
    product_name: str
    description: Optional[str] = None
    buying_price: Decimal = Decimal('0.00')
    selling_price: Decimal = Decimal('0.00')
    stock_quantity: int = 0
    minimum_stock: int = 5
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    product_code: Optional[str] = None
    barcode: Optional[str] = None
    product_name: Optional[str] = None
    description: Optional[str] = None
    buying_price: Optional[Decimal] = None
    selling_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    minimum_stock: Optional[int] = None
    image_url: Optional[str] = None
    status: Optional[str] = None


class ProductOut(BaseModel):
    id: int
    business_id: int
    category_id: Optional[int] = None
    product_code: Optional[str] = None
    barcode: Optional[str] = None
    product_name: str
    description: Optional[str] = None
    buying_price: Decimal
    selling_price: Decimal
    stock_quantity: int
    minimum_stock: int
    image_url: Optional[str] = None
    status: str
    created_at: datetime
    category_name: Optional[str] = None

    class Config:
        from_attributes = True


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    selling_price: Decimal


class SaleCreate(BaseModel):
    items: list[SaleItemCreate]
    payment_method: str = 'cash'
    notes: Optional[str] = None


class SaleItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    buying_price: Decimal
    selling_price: Decimal
    total_amount: Decimal
    profit: Decimal

    class Config:
        from_attributes = True


class SaleOut(BaseModel):
    id: int
    business_id: int
    seller_id: int
    seller_name: Optional[str] = None
    receipt_number: str
    total_amount: Decimal
    total_profit: Decimal
    payment_method: str
    notes: Optional[str] = None
    sale_date: datetime
    created_at: datetime
    items: list[SaleItemOut] = []

    class Config:
        from_attributes = True


class StockMovementCreate(BaseModel):
    product_id: int
    movement_type: str
    quantity: int
    notes: Optional[str] = None


class StockMovementOut(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    movement_type: str
    quantity: int
    previous_stock: int
    new_stock: int
    notes: Optional[str] = None
    created_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_revenue: float
    total_profit: float
    total_products: int
    total_sales: int
    products_sold: int
    low_stock_count: int
    active_categories: int


class ChartDataPoint(BaseModel):
    label: str
    value: float

class ChartSeries(BaseModel):
    name: str
    data: list[float]

class ChartResponse(BaseModel):
    labels: list[str]
    series: list[ChartSeries]

class RecentOrder(BaseModel):
    id: int
    receipt_number: str
    total_amount: float
    total_profit: float
    customer: Optional[str] = None
    items_count: int
    sale_date: datetime

class AdminDashboardStats(BaseModel):
    total_revenue: float
    total_profit: float
    total_products: int
    total_sales: int
    products_sold: int
    low_stock_count: int
    active_categories: int
    active_users: int
    total_users: int
    total_businesses: Optional[int] = None

class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    module: str
    description: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
