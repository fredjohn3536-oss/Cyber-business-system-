from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import Product, Category, StockMovement, User
from schemas import ProductCreate, ProductOut, ProductUpdate, StockMovementCreate, StockMovementOut
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/products", tags=["Products"])


def _product_to_out(p: Product) -> ProductOut:
    out = ProductOut.model_validate(p)
    out.category_name = p.category.name if p.category else None
    return out


@router.get("", response_model=list[ProductOut])
def list_products(
    category_id: int | None = Query(None),
    search: str | None = Query(None),
    low_stock: bool = Query(False),
    status_filter: str | None = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Product).options(joinedload(Product.category)).filter(
        Product.business_id == current_user.business_id
    )

    if category_id:
        q = q.filter(Product.category_id == category_id)
    if search:
        q = q.filter(Product.product_name.ilike(f"%{search}%"))
    if low_stock:
        q = q.filter(Product.stock_quantity <= Product.minimum_stock)
    if status_filter:
        q = q.filter(Product.status == status_filter)

    products = q.all()
    return [_product_to_out(p) for p in products]


@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = db.query(Product).options(joinedload(Product.category)).filter(
        Product.id == product_id,
        Product.business_id == current_user.business_id,
    ).first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return _product_to_out(p)


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    req: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin', 'manager')),
):
    if req.category_id:
        cat = db.query(Category).filter(
            Category.id == req.category_id,
            Category.business_id == current_user.business_id,
        ).first()
        if not cat:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found")

    product = Product(business_id=current_user.business_id, **req.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    db.refresh(product, attribute_names=['category'])

    if req.stock_quantity > 0:
        movement = StockMovement(
            product_id=product.id,
            movement_type='purchase',
            quantity=req.stock_quantity,
            previous_stock=0,
            new_stock=req.stock_quantity,
            created_by=current_user.id,
        )
        db.add(movement)
        db.commit()

    return _product_to_out(product)


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    req: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin', 'manager')),
):
    p = db.query(Product).options(joinedload(Product.category)).filter(
        Product.id == product_id,
        Product.business_id == current_user.business_id,
    ).first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    old_stock = p.stock_quantity
    update_data = req.model_dump(exclude_unset=True)

    for key, val in update_data.items():
        setattr(p, key, val)
    db.commit()
    db.refresh(p)

    if 'stock_quantity' in update_data:
        diff = p.stock_quantity - old_stock
        if diff != 0:
            movement = StockMovement(
                product_id=p.id,
                movement_type='adjustment' if diff > 0 else 'sale',
                quantity=abs(diff),
                previous_stock=old_stock,
                new_stock=p.stock_quantity,
                notes="Stock adjustment via product update",
                created_by=current_user.id,
            )
            db.add(movement)
            db.commit()

    return _product_to_out(p)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin')),
):
    p = db.query(Product).filter(
        Product.id == product_id,
        Product.business_id == current_user.business_id,
    ).first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(p)
    db.commit()
