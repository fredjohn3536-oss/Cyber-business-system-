from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Category, User
from schemas import CategoryCreate, CategoryOut, CategoryUpdate
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryOut])
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Category).filter(Category.business_id == current_user.business_id).all()


@router.get("/{category_id}", response_model=CategoryOut)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cat = db.query(Category).filter(
        Category.id == category_id,
        Category.business_id == current_user.business_id,
    ).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return cat


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    req: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin', 'manager')),
):
    existing = db.query(Category).filter(
        Category.business_id == current_user.business_id,
        Category.name == req.name,
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")

    cat = Category(business_id=current_user.business_id, **req.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    req: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin', 'manager')),
):
    cat = db.query(Category).filter(
        Category.id == category_id,
        Category.business_id == current_user.business_id,
    ).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    for key, val in req.model_dump(exclude_unset=True).items():
        setattr(cat, key, val)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin')),
):
    cat = db.query(Category).filter(
        Category.id == category_id,
        Category.business_id == current_user.business_id,
    ).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    db.delete(cat)
    db.commit()
