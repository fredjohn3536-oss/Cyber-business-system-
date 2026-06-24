from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Database connection URL (MySQL)
# Update this with the actual DB credentials
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:password@localhost/cyber_business_system"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to inject DB session into routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
