# Aura E-Zindagi Database Structure

## Overview
This document outlines the complete database structure for the Aura E-Zindagi perfume e-commerce application based on frontend analysis.

## Database Tables & Fields

### 1. Users Table
```sql
users
├── id (Primary Key, Auto Increment)
├── name (VARCHAR 255, NOT NULL)
├── email (VARCHAR 255, UNIQUE, NOT NULL)
├── email_verified_at (TIMESTAMP, NULLABLE)
├── password (VARCHAR 255, NOT NULL)
├── role (ENUM: 'admin', 'user', DEFAULT: 'user')
├── avatar (VARCHAR 255, NULLABLE)
├── phone (VARCHAR 20, NULLABLE)
├── remember_token (VARCHAR 100, NULLABLE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 2. Categories Table
```sql
categories
├── id (Primary Key, Auto Increment)
├── name (VARCHAR 100, NOT NULL) // Men's Perfume, Women's Perfume, Unisex Perfume
├── slug (VARCHAR 100, UNIQUE, NOT NULL)
├── description (TEXT, NULLABLE)
├── image (VARCHAR 255, NULLABLE)
├── is_active (BOOLEAN, DEFAULT: true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 3. Products Table
```sql
products
├── id (Primary Key, Auto Increment)
├── name (VARCHAR 255, NOT NULL)
├── slug (VARCHAR 255, UNIQUE, NOT NULL)
├── description (TEXT, NULLABLE)
├── long_description (TEXT, NULLABLE)
├── sku (VARCHAR 100, UNIQUE, NOT NULL)
├── brand_name (VARCHAR 100, NOT NULL)
├── fragrance_type (ENUM: 'EDP', 'EDT', 'EDC', 'Oil')
├── notes (VARCHAR 500, NULLABLE) // Oud, Musk, Amber
├── category_id (Foreign Key -> categories.id)
├── base_price (DECIMAL 10,2, NOT NULL)
├── discount_percentage (DECIMAL 5,2, DEFAULT: 0)
├── stock_quantity (INT, DEFAULT: 0)
├── minimum_stock (INT, DEFAULT: 10)
├── rating (DECIMAL 3,2, DEFAULT: 0)
├── status (ENUM: 'active', 'inactive', 'draft', DEFAULT: 'active')
├── is_featured (BOOLEAN, DEFAULT: false)
├── meta_title (VARCHAR 255, NULLABLE)
├── meta_description (TEXT, NULLABLE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 4. Product Variants Table
```sql
product_variants
├── id (Primary Key, Auto Increment)
├── product_id (Foreign Key -> products.id)
├── size (VARCHAR 20, NOT NULL) // 25ml, 50ml, 100ml, etc.
├── price (DECIMAL 10,2, NOT NULL)
├── stock_quantity (INT, DEFAULT: 0)
├── sku_variant (VARCHAR 100, UNIQUE, NOT NULL)
├── is_active (BOOLEAN, DEFAULT: true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 5. Product Images Table
```sql
product_images
├── id (Primary Key, Auto Increment)
├── product_id (Foreign Key -> products.id)
├── image_path (VARCHAR 255, NOT NULL)
├── alt_text (VARCHAR 255, NULLABLE)
├── is_primary (BOOLEAN, DEFAULT: false)
├── sort_order (INT, DEFAULT: 0)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 6. Customers Table
```sql
customers
├── id (Primary Key, Auto Increment)
├── user_id (Foreign Key -> users.id, NULLABLE)
├── name (VARCHAR 255, NOT NULL)
├── email (VARCHAR 255, NOT NULL)
├── phone (VARCHAR 20, NULLABLE)
├── city (VARCHAR 100, NULLABLE)
├── street_address (TEXT, NULLABLE)
├── postal_code (VARCHAR 20, NULLABLE)
├── total_orders (INT, DEFAULT: 0)
├── total_spent (DECIMAL 12,2, DEFAULT: 0)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 7. Orders Table
```sql
orders
├── id (Primary Key, Auto Increment)
├── order_number (VARCHAR 50, UNIQUE, NOT NULL)
├── customer_id (Foreign Key -> customers.id)
├── user_id (Foreign Key -> users.id, NULLABLE)
├── status (ENUM: 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')
├── payment_status (ENUM: 'unpaid', 'paid', 'refunded', 'partially_refunded')
├── payment_method (ENUM: 'cod', 'bank_transfer', 'card')
├── subtotal (DECIMAL 10,2, NOT NULL)
├── discount_amount (DECIMAL 10,2, DEFAULT: 0)
├── shipping_cost (DECIMAL 8,2, DEFAULT: 0)
├── cod_charges (DECIMAL 8,2, DEFAULT: 0)
├── tax_amount (DECIMAL 8,2, DEFAULT: 0)
├── total_amount (DECIMAL 10,2, NOT NULL)
├── currency (VARCHAR 3, DEFAULT: 'PKR')
├── delivery_method (VARCHAR 100, DEFAULT: 'Free shipping')
├── shipping_address (JSON)
├── billing_address (JSON)
├── notes (TEXT, NULLABLE)
├── shipped_at (TIMESTAMP, NULLABLE)
├── delivered_at (TIMESTAMP, NULLABLE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 8. Order Items Table
```sql
order_items
├── id (Primary Key, Auto Increment)
├── order_id (Foreign Key -> orders.id)
├── product_id (Foreign Key -> products.id)
├── product_variant_id (Foreign Key -> product_variants.id, NULLABLE)
├── product_name (VARCHAR 255, NOT NULL)
├── product_sku (VARCHAR 100, NOT NULL)
├── size (VARCHAR 20, NULLABLE)
├── quantity (INT, NOT NULL)
├── unit_price (DECIMAL 10,2, NOT NULL)
├── total_price (DECIMAL 10,2, NOT NULL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 9. Shopping Cart Table
```sql
shopping_carts
├── id (Primary Key, Auto Increment)
├── user_id (Foreign Key -> users.id, NULLABLE)
├── session_id (VARCHAR 255, NULLABLE)
├── product_id (Foreign Key -> products.id)
├── product_variant_id (Foreign Key -> product_variants.id, NULLABLE)
├── quantity (INT, NOT NULL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 10. Testers Table
```sql
testers
├── id (Primary Key, Auto Increment)
├── name (VARCHAR 255, NOT NULL)
├── description (TEXT, NULLABLE)
├── price (DECIMAL 8,2, NOT NULL)
├── size (VARCHAR 20, DEFAULT: '5ml')
├── image (VARCHAR 255, NULLABLE)
├── stock_quantity (INT, DEFAULT: 0)
├── is_active (BOOLEAN, DEFAULT: true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 11. Reviews Table
```sql
reviews
├── id (Primary Key, Auto Increment)
├── product_id (Foreign Key -> products.id)
├── user_id (Foreign Key -> users.id)
├── order_id (Foreign Key -> orders.id, NULLABLE)
├── rating (INT, CHECK: rating >= 1 AND rating <= 5)
├── title (VARCHAR 255, NULLABLE)
├── comment (TEXT, NULLABLE)
├── is_verified_purchase (BOOLEAN, DEFAULT: false)
├── is_approved (BOOLEAN, DEFAULT: false)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 12. Coupons Table
```sql
coupons
├── id (Primary Key, Auto Increment)
├── code (VARCHAR 50, UNIQUE, NOT NULL)
├── type (ENUM: 'percentage', 'fixed_amount')
├── value (DECIMAL 8,2, NOT NULL)
├── minimum_order_amount (DECIMAL 10,2, NULLABLE)
├── maximum_discount_amount (DECIMAL 10,2, NULLABLE)
├── usage_limit (INT, NULLABLE)
├── used_count (INT, DEFAULT: 0)
├── starts_at (TIMESTAMP, NULLABLE)
├── expires_at (TIMESTAMP, NULLABLE)
├── is_active (BOOLEAN, DEFAULT: true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 13. Inventory Logs Table
```sql
inventory_logs
├── id (Primary Key, Auto Increment)
├── product_id (Foreign Key -> products.id)
├── product_variant_id (Foreign Key -> product_variants.id, NULLABLE)
├── type (ENUM: 'in', 'out', 'adjustment')
├── quantity (INT, NOT NULL)
├── previous_stock (INT, NOT NULL)
├── new_stock (INT, NOT NULL)
├── reason (VARCHAR 255, NULLABLE)
├── reference_id (INT, NULLABLE) // Order ID or other reference
├── user_id (Foreign Key -> users.id, NULLABLE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Implementation Sequence

### Phase 1: Core Tables
1. **users** - Authentication & user management
2. **categories** - Product categorization
3. **products** - Main product catalog
4. **product_variants** - Size/price variations
5. **product_images** - Product gallery

### Phase 2: Customer & Order Management
6. **customers** - Customer information
7. **orders** - Order processing
8. **order_items** - Order line items
9. **shopping_carts** - Cart functionality

### Phase 3: Additional Features
10. **testers** - Tester products
11. **reviews** - Product reviews
12. **coupons** - Discount system
13. **inventory_logs** - Stock tracking

## Key Relationships

- **Products** → **Categories** (Many-to-One)
- **Products** → **Product Variants** (One-to-Many)
- **Products** → **Product Images** (One-to-Many)
- **Orders** → **Customers** (Many-to-One)
- **Orders** → **Order Items** (One-to-Many)
- **Order Items** → **Products** (Many-to-One)
- **Reviews** → **Products** & **Users** (Many-to-One)
- **Shopping Carts** → **Users** & **Products** (Many-to-One)

## Indexes Recommendations

```sql
-- Performance indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_shopping_carts_user ON shopping_carts(user_id);
```

## Notes

- All monetary values use DECIMAL for precision
- JSON fields for flexible address storage
- ENUM fields for controlled status values
- Proper foreign key constraints for data integrity
- Timestamps for audit trails
- Soft deletes can be added where needed
- Consider adding full-text search indexes for product search