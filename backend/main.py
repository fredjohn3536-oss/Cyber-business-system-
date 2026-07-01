import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, categories, products, sales, dashboard, stock, admin

Base.metadata.create_all(bind=engine)

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
    return {"status": "ok"}
