import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import Sale, SaleItem, Product, StockMovement, Receipt, User
from schemas import SaleCreate, SaleOut
from auth import get_current_user, require_role

router = APIRouter(prefix="/api/sales", tags=["Sales"])


def _generate_receipt_number() -> str:
    return f"RCP-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"


@router.post("", response_model=SaleOut, status_code=status.HTTP_201_CREATED)
def create_sale(
    req: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not req.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sale must have at least one item")

    receipt_number = _generate_receipt_number()
    sale_date = datetime.now(timezone.utc)
    total_amount = 0
    total_profit = 0
    sale_items_data = []

    for item_req in req.items:
        product = db.query(Product).filter(
            Product.id == item_req.product_id,
            Product.business_id == current_user.business_id,
        ).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item_req.product_id} not found")
        if product.stock_quantity < item_req.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.product_name}': have {product.stock_quantity}, need {item_req.quantity}",
            )

        item_total = item_req.selling_price * item_req.quantity
        item_profit = (item_req.selling_price - product.buying_price) * item_req.quantity
        total_amount += item_total
        total_profit += item_profit

        sale_items_data.append({
            "product_id": product.id,
            "product_name": product.product_name,
            "quantity": item_req.quantity,
            "buying_price": product.buying_price,
            "selling_price": item_req.selling_price,
            "total_amount": item_total,
            "profit": item_profit,
            "_product": product,
        })

    sale = Sale(
        business_id=current_user.business_id,
        seller_id=current_user.id,
        receipt_number=receipt_number,
        total_amount=total_amount,
        total_profit=total_profit,
        payment_method=req.payment_method,
        notes=req.notes,
        sale_date=sale_date,
    )
    db.add(sale)
    db.flush()

    for item_data in sale_items_data:
        product = item_data.pop("_product")
        item = SaleItem(
            sale_id=sale.id,
            product_id=product.id,
            quantity=item_data["quantity"],
            buying_price=item_data["buying_price"],
            selling_price=item_data["selling_price"],
            total_amount=item_data["total_amount"],
            profit=item_data["profit"],
        )
        db.add(item)

        old_stock = product.stock_quantity
        product.stock_quantity -= item_data["quantity"]
        movement = StockMovement(
            product_id=product.id,
            movement_type='sale',
            quantity=item_data["quantity"],
            previous_stock=old_stock,
            new_stock=product.stock_quantity,
            created_by=current_user.id,
        )
        db.add(movement)

    receipt = Receipt(
        sale_id=sale.id,
        receipt_number=receipt_number,
    )
    db.add(receipt)
    db.commit()
    db.refresh(sale)

    return _load_sale(db, sale.id, current_user.business_id)


def _load_sale(db: Session, sale_id: int, business_id: int) -> SaleOut:
    sale = db.query(Sale).options(
        joinedload(Sale.items).joinedload(SaleItem.product),
        joinedload(Sale.seller),
    ).filter(Sale.id == sale_id, Sale.business_id == business_id).first()

    out = SaleOut.model_validate(sale)
    out.seller_name = sale.seller.full_name if sale.seller else None
    out.items = []
    for item in sale.items:
        item_out = SaleItemOut(
            id=item.id,
            product_id=item.product_id,
            product_name=item.product.product_name,
            quantity=item.quantity,
            buying_price=item.buying_price,
            selling_price=item.selling_price,
            total_amount=item.total_amount,
            profit=item.profit,
        )
        out.items.append(item_out)
    return out


@router.get("", response_model=list[SaleOut])
def list_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sales = db.query(Sale).options(
        joinedload(Sale.items).joinedload(SaleItem.product),
        joinedload(Sale.seller),
    ).filter(Sale.business_id == current_user.business_id).order_by(Sale.created_at.desc()).all()

    result = []
    for sale in sales:
        out = SaleOut.model_validate(sale)
        out.seller_name = sale.seller.full_name if sale.seller else None
        out.items = []
        for item in sale.items:
            out.items.append(SaleItemOut(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.product_name,
                quantity=item.quantity,
                buying_price=item.buying_price,
                selling_price=item.selling_price,
                total_amount=item.total_amount,
                profit=item.profit,
            ))
        result.append(out)
    return result


@router.get("/{sale_id}", response_model=SaleOut)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _load_sale(db, sale_id, current_user.business_id)


from schemas import SaleItemOut
