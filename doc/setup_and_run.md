# Setup and Run Guide

## Prerequisites

- Python 3.12+
- Node.js 18+
- MySQL (optional — SQLite fallback works out of the box)

---

## Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Linux/macOS
# venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

### Database

**Option A — SQLite (default, no setup required)**
The backend auto-creates a `cyber_business.db` file in the `backend/` directory on first run. No configuration needed.

**Option B — MySQL**
See `doc/database_setup.md` for installation instructions. Set the `DATABASE_URL` env var:
```bash
export DATABASE_URL=mysql+pymysql://root:password@localhost/cyber_business_system
```

### Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API is available at `http://localhost:8000`. Tables are auto-created on startup.

### Test

```bash
# Health check
curl http://localhost:8000/health

# Register a business + admin user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123!","full_name":"Admin","username":"admin","business_name":"My Business"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Test123!"}'
```

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check (reports DB status) |
| `POST /api/auth/register` | Register new business + user |
| `POST /api/auth/login` | Login, returns JWT |
| `GET /api/auth/me` | Current user info |
| `GET /api/dashboard/stats` | Aggregate dashboard stats |
| `GET /api/dashboard/charts/monthly` | Monthly revenue/profit (12 months) |
| `GET /api/dashboard/charts/weekly` | Weekly revenue/profit (7 days) |
| `GET /api/dashboard/recent-orders` | Last 10 orders |
| `GET /api/admin/dashboard` | Admin dashboard stats (incl. user counts) |
| `GET /api/admin/users` | List users (admin/super_admin) |
| `PUT /api/admin/users/{id}/status` | Toggle user active/inactive (super_admin) |
| `GET /api/admin/audit-logs` | Recent audit logs |
| `GET /api/admin/business` | Get business info |
| `PUT /api/admin/business` | Update business info |
| `GET /api/categories` | List categories |
| `POST /api/categories` | Create category |
| `GET /api/products` | List products (?search=&low_stock=1) |
| `POST /api/products` | Create product |
| `POST /api/sales` | Create sale (deducts stock, creates receipt) |
| `GET /api/stock/movements` | Stock movement history |

---

## Frontend Setup

```bash
cd frontend
npm install
```

### Run (Development)

```bash
npm run dev
```

Opens at `http://localhost:5173`. The frontend proxies API calls to `http://localhost:8000` (configurable via `VITE_API_URL` env var).

### Build (Production)

```bash
npm run build
```

Output is in `frontend/dist/`. Serve with any static file server.

---

## Quick Start (Full Stack)

```bash
# Terminal 1 — Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in a browser. Click **Get Started** to register a new business, then log in.

---

## Architecture Overview

```
frontend/          React 19 + Vite + MUI v9 + @mui/x-charts
  └── src/
      ├── pages/
      │   ├── Dashboard.jsx       Mantis-style dashboard with live charts
      │   ├── AdminDashboard.jsx  Admin dashboard with its own endpoint
      │   ├── Admin.jsx           User/stock/audit management (tabs)
      │   ├── Products.jsx        Product creation
      │   ├── ProductList.jsx     Inventory table with search
      │   ├── Sales.jsx           Point of Sale interface
      │   ├── Login.jsx           Auth login
      │   └── Register.jsx        Registration with business creation
      ├── components/
      │   ├── Sidebar.jsx         Navigation sidebar
      │   ├── MainCard.jsx        Reusable MUI card wrapper
      │   └── StatCard.jsx        Stat card with trend chip
      ├── context/
      │   ├── AuthContext.jsx     JWT auth + token management
      │   └── StoreContext.jsx    Products, sales, categories state
      └── services/
          └── api.js              Axios client with all API methods

backend/           FastAPI + SQLAlchemy + SQLite/MySQL
  ├── main.py          App entry, CORS, health check
  ├── database.py      DB engine, session factory
  ├── models.py        9 SQLAlchemy models
  ├── schemas.py       Pydantic request/response schemas
  ├── auth.py          JWT creation, password hashing (bcrypt)
  └── routers/
      ├── auth.py      Register, login, me
      ├── dashboard.py Stats + chart data endpoints
      ├── admin.py     Admin dashboard + user mgmt + audit
      ├── categories.py CRUD for categories
      ├── products.py  CRUD + search for products
      ├── sales.py     Create/list sales with stock deduction
      └── stock.py     Stock movement history
```
