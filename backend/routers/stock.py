from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import StockMovement, Product, User
from schemas import StockMovementCreate, StockMovementOut
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/stock", tags=["Stock Movements"])


@router.get("/movements", response_model=list[StockMovementOut])
def list_movements(
    product_id: int | None = Query(None),
    movement_type: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(StockMovement).options(
        joinedload(StockMovement.product),
        joinedload(StockMovement.user),
    ).filter(StockMovement.product.has(business_id=current_user.business_id))

    if product_id:
        q = q.filter(StockMovement.product_id == product_id)
    if movement_type:
        q = q.filter(StockMovement.movement_type == movement_type)

    movements = q.order_by(StockMovement.created_at.desc()).all()
    result = []
    for m in movements:
        out = StockMovementOut.model_validate(m)
        out.product_name = m.product.product_name if m.product else None
        result.append(out)
    return result


@router.post("/movements", response_model=StockMovementOut, status_code=status.HTTP_201_CREATED)
def create_movement(
    req: StockMovementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role('super_admin', 'admin', 'manager')),
):
    product = db.query(Product).filter(
        Product.id == req.product_id,
        Product.business_id == current_user.business_id,
    ).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    old_stock = product.stock_quantity
    if req.movement_type in ('sale', 'damaged', 'expired'):
        if product.stock_quantity < req.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient stock")
        product.stock_quantity -= req.quantity
    elif req.movement_type in ('purchase', 'return'):
        product.stock_quantity += req.quantity
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid movement type")

    movement = StockMovement(
        product_id=req.product_id,
        movement_type=req.movement_type,
        quantity=req.quantity,
        previous_stock=old_stock,
        new_stock=product.stock_quantity,
        notes=req.notes,
        created_by=current_user.id,
    )
    db.add(movement)
    db.commit()
    db.refresh(movement)

    out = StockMovementOut.model_validate(movement)
    out.product_name = product.product_name
    return out
