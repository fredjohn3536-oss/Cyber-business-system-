from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Product, Sale, SaleItem, Category, User
from schemas import DashboardStats
from auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    biz_id = current_user.business_id

    total_revenue = db.query(func.coalesce(func.sum(Sale.total_amount), 0)).filter(
        Sale.business_id == biz_id
    ).scalar()

    total_profit = db.query(func.coalesce(func.sum(Sale.total_profit), 0)).filter(
        Sale.business_id == biz_id
    ).scalar()

    total_products = db.query(func.count(Product.id)).filter(
        Product.business_id == biz_id,
        Product.status == 'active',
    ).scalar()

    total_sales = db.query(func.count(Sale.id)).filter(
        Sale.business_id == biz_id
    ).scalar()

    products_sold = db.query(func.coalesce(func.sum(SaleItem.quantity), 0)).join(
        Sale, SaleItem.sale_id == Sale.id
    ).filter(Sale.business_id == biz_id).scalar()

    low_stock_count = db.query(func.count(Product.id)).filter(
        Product.business_id == biz_id,
        Product.stock_quantity <= Product.minimum_stock,
        Product.status == 'active',
    ).scalar()

    active_categories = db.query(func.count(Category.id)).filter(
        Category.business_id == biz_id
    ).scalar()

    return DashboardStats(
        total_revenue=float(total_revenue),
        total_profit=float(total_profit),
        total_products=total_products,
        total_sales=total_sales,
        products_sold=products_sold,
        low_stock_count=low_stock_count,
        active_categories=active_categories,
    )
