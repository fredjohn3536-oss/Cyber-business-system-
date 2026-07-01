import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from database import engine, Base
from routers import auth, categories, products, sales, dashboard, stock, admin

try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"WARNING: Could not connect to database: {e}")
    print("The server will start, but database-dependent features will fail.")

app = FastAPI(title="Cyber Business System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(sales.router)
app.include_router(dashboard.router)
app.include_router(stock.router)
app.include_router(admin.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Cyber Business System API"}


@app.get("/health")
def health_check():
    db_status = "disconnected"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            db_status = "connected"
    except Exception:
        db_status = "disconnected"
    return {"status": "ok", "database": db_status}
