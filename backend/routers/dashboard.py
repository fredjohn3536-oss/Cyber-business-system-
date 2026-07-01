from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from database import get_db
from models import Product, Sale, SaleItem, Category, User
from schemas import DashboardStats, ChartResponse, ChartSeries, RecentOrder
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


@router.get("/charts/monthly", response_model=ChartResponse)
def monthly_chart_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    biz_id = current_user.business_id
    now = datetime.now(timezone.utc)
    labels = []
    revenue_data = []
    profit_data = []

    for i in range(11, -1, -1):
        first_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0) - timedelta(days=30 * i)
        month_name = first_of_month.strftime("%b")
        labels.append(month_name)

        month_revenue = db.query(func.coalesce(func.sum(Sale.total_amount), 0)).filter(
            Sale.business_id == biz_id,
            extract("year", Sale.sale_date) == first_of_month.year,
            extract("month", Sale.sale_date) == first_of_month.month,
        ).scalar()

        month_profit = db.query(func.coalesce(func.sum(Sale.total_profit), 0)).filter(
            Sale.business_id == biz_id,
            extract("year", Sale.sale_date) == first_of_month.year,
            extract("month", Sale.sale_date) == first_of_month.month,
        ).scalar()

        revenue_data.append(float(month_revenue))
        profit_data.append(float(month_profit))

    return ChartResponse(
        labels=labels,
        series=[
            ChartSeries(name="Income", data=revenue_data),
            ChartSeries(name="Profit", data=profit_data),
        ],
    )


@router.get("/charts/weekly", response_model=ChartResponse)
def weekly_chart_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    biz_id = current_user.business_id
    now = datetime.now(timezone.utc)
    labels = []
    revenue_data = []
    profit_data = []
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        labels.append(day_names[day.weekday()])

        day_revenue = db.query(func.coalesce(func.sum(Sale.total_amount), 0)).filter(
            Sale.business_id == biz_id,
            func.date(Sale.sale_date) == day.date(),
        ).scalar()

        day_profit = db.query(func.coalesce(func.sum(Sale.total_profit), 0)).filter(
            Sale.business_id == biz_id,
            func.date(Sale.sale_date) == day.date(),
        ).scalar()

        revenue_data.append(float(day_revenue))
        profit_data.append(float(day_profit))

    return ChartResponse(
        labels=labels,
        series=[
            ChartSeries(name="Revenue", data=revenue_data),
            ChartSeries(name="Profit", data=profit_data),
        ],
    )


@router.get("/recent-orders", response_model=list[RecentOrder])
def recent_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sales = (
        db.query(Sale)
        .filter(Sale.business_id == current_user.business_id)
        .order_by(Sale.created_at.desc())
        .limit(10)
        .all()
    )
    result = []
    for sale in sales:
        items_count = db.query(func.count(SaleItem.id)).filter(
            SaleItem.sale_id == sale.id
        ).scalar()
        result.append(RecentOrder(
            id=sale.id,
            receipt_number=sale.receipt_number,
            total_amount=float(sale.total_amount),
            total_profit=float(sale.total_profit),
            items_count=items_count,
            sale_date=sale.sale_date,
        ))
    return result
