# Backend Preparation Guide: FastAPI

The `/backend/` directory is dedicated to the Python FastAPI application. This server acts as the bridge between the React frontend and the MySQL database.

## Why FastAPI?
FastAPI is a modern, fast, web framework for building APIs with Python. It provides:
- Extremely high performance.
- Automatic interactive API documentation (Swagger UI).
- Built-in data validation using Pydantic.

## Next Steps for Setup

To initialize the backend:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:

   **For Linux / macOS:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
   
   **For Windows 11 (Command Prompt / PowerShell):**
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install required packages:
   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql passlib[bcrypt] pyjwt
   ```
4. Freeze dependencies into a `requirements.txt`:
   ```bash
   pip freeze > requirements.txt
   ```

## Key Components to Build
- **`main.py`:** The entry point for the FastAPI server.
- **`database.py`:** Configuration for connecting to the MySQL database (mapping to `db_schema.sql`).
- **`models.py`:** SQLAlchemy ORM models representing the database tables (Businesses, Users, Products, Sales).
- **`schemas.py`:** Pydantic models for data validation (what data React is allowed to send, and what it receives).
- **`routers/`:** Separate files for API endpoints (e.g., `/api/auth`, `/api/products`, `/api/sales`).
- **Authentication:** Implement JWT (JSON Web Tokens) to secure the API and handle the user roles defined in the database schema.

## How to Run

To start the FastAPI development server:

1. Navigate to the backend directory and activate your virtual environment:
   ```bash
   cd backend
   source venv/bin/activate  # Or venv\Scripts\activate on Windows
   ```
2. Run the Uvicorn server:
   ```bash
   uvicorn main:app --reload
   ```
3. Open your browser and navigate to `http://localhost:8000/docs` to view the automatic interactive API documentation (Swagger UI).
