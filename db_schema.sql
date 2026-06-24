-- ==========================================
-- CYBER BUSINESS SYSTEM DATABASE
-- Version: 1.0
-- Database Engine: MySQL 8+
-- ==========================================

DROP DATABASE IF EXISTS cyber_business_system;
CREATE DATABASE cyber_business_system;
USE cyber_business_system;

-- ==========================================
-- BUSINESSES
-- ==========================================

CREATE TABLE businesses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    business_name VARCHAR(150) NOT NULL,
    logo_url TEXT,

    phone VARCHAR(30),
    email VARCHAR(150),

    address TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- USERS
-- ==========================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    business_id BIGINT NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    username VARCHAR(100) NOT NULL UNIQUE,

    email VARCHAR(150) UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM(
        'super_admin',
        'admin',
        'manager',
        'seller'
    ) NOT NULL DEFAULT 'seller',

    status ENUM(
        'active',
        'inactive'
    ) DEFAULT 'active',

    last_login DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

-- ==========================================
-- CATEGORIES
-- ==========================================

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    business_id BIGINT NOT NULL,

    name VARCHAR(100) NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,

    UNIQUE KEY uq_category_name (
        business_id,
        name
    )
);

-- ==========================================
-- PRODUCTS
-- ==========================================

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    business_id BIGINT NOT NULL,

    category_id BIGINT NULL,

    product_code VARCHAR(50) UNIQUE,

    barcode VARCHAR(100) UNIQUE,

    product_name VARCHAR(200) NOT NULL,

    description TEXT,

    buying_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    selling_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    stock_quantity INT NOT NULL DEFAULT 0,

    minimum_stock INT NOT NULL DEFAULT 5,

    image_url TEXT,

    status ENUM(
        'active',
        'inactive'
    ) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- ==========================================
-- SALES
-- ==========================================

CREATE TABLE sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    business_id BIGINT NOT NULL,

    seller_id BIGINT NOT NULL,

    receipt_number VARCHAR(100) UNIQUE NOT NULL,

    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    total_profit DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    payment_method ENUM(
        'cash',
        'card',
        'mobile_money',
        'bank_transfer'
    ) NOT NULL DEFAULT 'cash',

    notes TEXT,

    sale_date DATETIME NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sales_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_sales_seller
        FOREIGN KEY (seller_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

-- ==========================================
-- SALE ITEMS
-- ==========================================

CREATE TABLE sale_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    sale_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    quantity INT NOT NULL,

    buying_price DECIMAL(15,2) NOT NULL,

    selling_price DECIMAL(15,2) NOT NULL,

    total_amount DECIMAL(15,2) NOT NULL,

    profit DECIMAL(15,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sale_items_sale
        FOREIGN KEY (sale_id)
        REFERENCES sales(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_sale_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
);

-- ==========================================
-- STOCK MOVEMENTS
-- ==========================================

CREATE TABLE stock_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT NOT NULL,

    movement_type ENUM(
        'purchase',
        'sale',
        'return',
        'adjustment',
        'damaged',
        'expired'
    ) NOT NULL,

    quantity INT NOT NULL,

    previous_stock INT NOT NULL,

    new_stock INT NOT NULL,

    notes TEXT,

    created_by BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_stock_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ==========================================
-- RECEIPTS
-- ==========================================

CREATE TABLE receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    sale_id BIGINT NOT NULL,

    receipt_number VARCHAR(100) NOT NULL UNIQUE,

    pdf_url TEXT,

    printed BOOLEAN DEFAULT FALSE,

    printed_at DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_receipts_sale
        FOREIGN KEY (sale_id)
        REFERENCES sales(id)
        ON DELETE CASCADE
);

-- ==========================================
-- AUDIT LOGS
-- ==========================================

CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NULL,

    action VARCHAR(255) NOT NULL,

    module VARCHAR(100) NOT NULL,

    description TEXT,

    ip_address VARCHAR(100),

    user_agent TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_products_name
ON products(product_name);

CREATE INDEX idx_products_code
ON products(product_code);

CREATE INDEX idx_sales_date
ON sales(sale_date);

CREATE INDEX idx_sales_seller
ON sales(seller_id);

CREATE INDEX idx_stock_product
ON stock_movements(product_id);

CREATE INDEX idx_audit_module
ON audit_logs(module);

-- ==========================================
-- DEFAULT SUPER ADMIN
-- Password should be replaced
-- with a bcrypt hash during setup
-- ==========================================

INSERT INTO businesses (
    business_name,
    phone,
    email
)
VALUES (
    'Cyber Business System',
    '+255000000000',
    'admin@cyberbusiness.com'
);

INSERT INTO users (
    business_id,
    full_name,
    username,
    email,
    password_hash,
    role
)
VALUES (
    1,
    'System Administrator',
    'admin',
    'admin@cyberbusiness.com',
    '$2b$10$replace_with_real_bcrypt_hash',
    'super_admin'
);