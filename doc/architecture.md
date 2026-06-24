# System Architecture Overview

The Cyber Business System is transitioning from a standalone HTML prototype into a robust, modern web application stack. 

This architecture isolates the user interface from the business logic and database interactions, providing better scalability, security, and developer experience.

## The Stack

1. **Frontend:** React.js
2. **Backend (API):** Python with FastAPI
3. **Database:** MySQL 8+

## High-Level Data Flow

1. **Client (Browser):** The user interacts with the **React** frontend.
2. **HTTP Requests:** React makes asynchronous HTTP requests (using `fetch` or `axios`) to the Backend REST API.
3. **Backend API:** The **FastAPI** server receives the requests, handles authentication, and applies business logic.
4. **Database:** FastAPI interacts with the **MySQL** database (using an ORM like SQLAlchemy) to read or write data based on `db_schema.sql`.
5. **Response:** FastAPI sends JSON data back to the React frontend.
6. **UI Update:** React updates the user interface dynamically with the new data.

## Directory Structure

- `/frontend/` - Contains the React application codebase.
- `/backend/` - Contains the Python FastAPI server and database connection logic.
- `/doc/` - Contains system documentation.
- `db_schema.sql` - The foundational database layout for the MySQL server.
- `homepage.html` - The legacy prototype (kept for reference).
