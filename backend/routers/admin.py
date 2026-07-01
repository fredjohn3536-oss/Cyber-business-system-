from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import User, Business, AuditLog, Product, Sale, SaleItem, Category
from schemas import UserCreate, UserOut, BusinessCreate, BusinessUpdate, BusinessOut, AuditLogOut, AdminDashboardStats, ChartResponse, ChartSeries
from auth import hash_password, get_current_user, require_role

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/dashboard", response_model=AdminDashboardStats)
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin')),
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

    total_users = db.query(func.count(User.id)).filter(
        User.business_id == biz_id
    ).scalar()

    active_users = db.query(func.count(User.id)).filter(
        User.business_id == biz_id,
        User.status == 'active',
    ).scalar()

    return AdminDashboardStats(
        total_revenue=float(total_revenue),
        total_profit=float(total_profit),
        total_products=total_products,
        total_sales=total_sales,
        products_sold=products_sold,
        low_stock_count=low_stock_count,
        active_categories=active_categories,
        active_users=active_users,
        total_users=total_users,
    )


@router.get("/users", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin')),
):
    return db.query(User).filter(User.business_id == current_user.business_id).all()


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    req: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin')),
):
    existing = db.query(User).filter(
        (User.username == req.username) | (User.email == req.email)
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or email already exists")

    user = User(
        business_id=current_user.business_id,
        full_name=req.full_name,
        username=req.username,
        email=req.email,
        password_hash=hash_password(req.password),
        role=req.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


@router.put("/users/{user_id}/status")
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin')),
):
    user = db.query(User).filter(
        User.id == user_id,
        User.business_id == current_user.business_id,
    ).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.status = 'inactive' if user.status == 'active' else 'active'
    db.commit()
    return {"status": user.status}


@router.get("/business", response_model=BusinessOut)
def get_business(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not business:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found")
    return BusinessOut.model_validate(business)


@router.put("/business", response_model=BusinessOut)
def update_business(
    req: BusinessUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin')),
):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not business:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found")
    for key, val in req.model_dump(exclude_unset=True).items():
        setattr(business, key, val)
    db.commit()
    db.refresh(business)
    return BusinessOut.model_validate(business)


@router.get("/audit-logs", response_model=list[AuditLogOut])
def list_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin')),
):
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()
