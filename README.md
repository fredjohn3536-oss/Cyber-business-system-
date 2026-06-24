# Cyber Business System

Cyber Business System is a lightweight, intuitive Point-of-Sale (POS) and inventory management application designed specifically for small businesses and independent sellers. 

The project currently features a functional frontend prototype for immediate, browser-based use, and a comprehensive backend database schema designed for future scalability and multi-tenant support.

## 🚀 Features

- **Store Customization:** Upload and display a custom business logo directly on the dashboard.
- **Inventory Management:** Add new products by defining name, category, stock quantity, buying cost, and expected selling price.
- **Dynamic Point of Sale (POS):** 
  - Products are automatically categorized for quick access.
  - View real-time stock levels and low-stock warnings (≤ 3 items).
  - Quickly process sales with inline quantity and price inputs.
- **Automated Financial Tracking:** Automatically calculates income and profit margins per sale.
- **Transaction Receipts:** Generates a detailed, on-screen receipt for every completed transaction.

## 📂 Project Structure

- **`homepage.html`**: The frontend prototype. This is a fully self-contained Single Page Application (SPA) built with pure HTML, CSS, and Vanilla JavaScript. It currently uses browser `localStorage` to persist data across sessions without needing a backend server.
- **`db_schema.sql`**: The blueprint for the system's future relational database. It is written for MySQL 8+ and includes tables for:
  - Multi-tenant businesses.
  - Role-based user authentication (Super Admin, Admin, Manager, Seller).
  - Normalized products and categories.
  - Comprehensive sales and receipt tracking.
  - Detailed stock movement history and security audit logs.
- **`admin.html`** *(Pending)*: The planned administrator dashboard for full business analytics, relying on the robust structure of `db_schema.sql`.

## 💻 How to Use (Frontend Prototype)

Since the current prototype relies entirely on your browser, no complex setup or server installation is required.

1. **Launch the App:** Simply double-click `homepage.html` to open it in any modern web browser (Chrome, Firefox, Edge, Safari).
2. **Customize:** Click the default store logo in the top left corner to upload your own business logo.
3. **Add Inventory:** 
   - Navigate to the **📦 Products** tab.
   - Fill out the product details and click "Add Product".
4. **Process Sales:**
   - Navigate to the **💰 Sales** tab.
   - Filter by categories or view "All".
   - Enter the quantity and sale price for a product, then click **Sell**.
   - A transaction receipt will immediately generate at the bottom of the screen.

> **⚠️ Important Note on Data Persistence:**
> The `homepage.html` prototype uses your browser's local storage. This means your inventory and sales data are stored directly on the specific browser and device you are currently using. Clearing your browser cache or switching devices will result in data loss. 

## 🔮 Roadmap

The next phase of development involves bridging the frontend prototype with the `db_schema.sql` architecture. This will require building a backend API (e.g., Node.js, Python FastAPI, or PHP) to handle secure data storage, user authentication, and comprehensive analytics.
