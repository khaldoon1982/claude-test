# 🗄️ RefurbX Supabase Database Schema

Complete PostgreSQL schema with Row Level Security policies for the RefurbX e-commerce platform.

---

## 📊 Entity Relationship Overview

```
brands (1) ──────< (N) products
categories (1) ───< (N) products
products (1) ─────< (N) product_i18n
products (1) ─────< (N) inventory
products (1) ─────< (N) cart_items
products (1) ─────< (N) order_items

users (1) ────────< (N) carts
users (1) ────────< (N) orders
users (1) ────────< (N) addresses

carts (1) ────────< (N) cart_items
orders (1) ───────< (N) order_items
```

---

## 🏗️ Complete SQL Schema

This SQL file should be placed in `/supabase/migrations/001_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE order_status AS ENUM (
  'pending',
  'payment_pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE address_type AS ENUM ('shipping', 'billing', 'both');

CREATE TYPE condition_grade AS ENUM ('A', 'A-', 'B+', 'B', 'C');

CREATE TYPE payment_provider AS ENUM ('stripe', 'mollie', 'ideal', 'creditcard');

-- =====================================================
-- BRANDS TABLE
-- =====================================================

CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_active ON brands(is_active);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) NOT NULL UNIQUE,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Basic Info
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,

  -- Condition
  condition_grade condition_grade NOT NULL,
  condition_notes TEXT,

  -- Specifications (Core)
  cpu VARCHAR(100),
  ram_gb INTEGER,
  storage_gb INTEGER,
  storage_type VARCHAR(50), -- SSD, HDD, NVMe
  gpu VARCHAR(100),

  -- Display
  screen_size_inch DECIMAL(4,2),
  screen_resolution VARCHAR(50), -- e.g., "1920x1080"
  screen_type VARCHAR(50), -- IPS, TN, OLED

  -- Battery
  battery_cycles INTEGER,
  battery_health_percent INTEGER,

  -- OS & Software
  os VARCHAR(100), -- "Windows 11 Pro", "No OS", etc.

  -- Pricing
  price_cents INTEGER NOT NULL, -- Store in cents to avoid floating point issues
  compare_at_price_cents INTEGER, -- Original price for "was/now" display
  currency VARCHAR(3) DEFAULT 'EUR',
  vat_rate DECIMAL(5,2) DEFAULT 21.00, -- NL VAT rate

  -- Stock & Availability
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_outlet BOOLEAN DEFAULT false, -- For deals page

  -- Media
  images JSONB, -- Array of image URLs: {"main": "url", "gallery": ["url1", "url2"]}

  -- Extended Specs (flexible JSON)
  specs JSONB, -- {"ports": ["USB-C x2", "HDMI"], "weight_kg": 1.5, ...}

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_outlet ON products(is_outlet);
CREATE INDEX idx_products_price ON products(price_cents);
CREATE INDEX idx_products_sku ON products(sku);

-- GIN index for JSONB specs for faster querying
CREATE INDEX idx_products_specs ON products USING GIN(specs);

-- =====================================================
-- PRODUCT TRANSLATIONS (i18n)
-- =====================================================

CREATE TABLE product_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL, -- 'nl', 'en', 'ar'
  title VARCHAR(255),
  description TEXT,
  condition_notes TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(product_id, locale)
);

CREATE INDEX idx_product_i18n_product ON product_i18n(product_id);
CREATE INDEX idx_product_i18n_locale ON product_i18n(locale);

-- =====================================================
-- INVENTORY (Stock Tracking)
-- =====================================================

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  serial_number VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'available', -- available, reserved, sold, returned
  location VARCHAR(100), -- Warehouse location
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_inventory_serial ON inventory(serial_number);

-- =====================================================
-- CARTS
-- =====================================================

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For anonymous carts
  locale VARCHAR(5) DEFAULT 'nl',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);
CREATE INDEX idx_carts_expires ON carts(expires_at);

-- =====================================================
-- CART ITEMS
-- =====================================================

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL, -- Snapshot price at time of adding
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- =====================================================
-- ADDRESSES
-- =====================================================

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type address_type DEFAULT 'both',

  -- Contact
  full_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(50),

  -- Address
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(2) NOT NULL DEFAULT 'NL', -- ISO 3166-1 alpha-2

  -- Meta
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(is_default);

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- Human-readable: RFX-2025-00001

  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Status
  status order_status DEFAULT 'pending',

  -- Pricing
  subtotal_cents INTEGER NOT NULL,
  vat_total_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',

  -- Payment
  payment_provider payment_provider,
  payment_intent_id VARCHAR(255), -- Stripe/Mollie payment ID
  payment_status VARCHAR(50),
  paid_at TIMESTAMP WITH TIME ZONE,

  -- Shipping
  shipping_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(255),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,

  -- Customer Info (snapshot for historical purposes)
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_name VARCHAR(255),

  -- Locale
  locale VARCHAR(5) DEFAULT 'nl',

  -- Notes
  customer_notes TEXT,
  internal_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_payment_intent ON orders(payment_intent_id);

-- =====================================================
-- ORDER ITEMS
-- =====================================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Snapshot data (in case product changes/deleted)
  sku VARCHAR(100) NOT NULL,
  product_title VARCHAR(255) NOT NULL,
  product_image_url TEXT,

  -- Pricing
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL,
  total_cents INTEGER NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- =====================================================
-- SETTINGS (Site Configuration)
-- =====================================================

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);

-- =====================================================
-- EMAIL LOGS (Track sent emails)
-- =====================================================

CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  email_type VARCHAR(50) NOT NULL, -- 'order_confirmation', 'password_reset', etc.
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  provider VARCHAR(50) DEFAULT 'resend',
  provider_id VARCHAR(255), -- Resend email ID
  status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, bounced, failed

  error_message TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user ON email_logs(user_id);
CREATE INDEX idx_email_logs_order ON email_logs(order_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- =====================================================
-- USER PROFILES (Extended user data)
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),

  -- Preferences
  preferred_locale VARCHAR(5) DEFAULT 'nl',
  newsletter_subscribed BOOLEAN DEFAULT false,

  -- Business
  is_business BOOLEAN DEFAULT false,
  company_name VARCHAR(255),
  vat_number VARCHAR(50),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_locale ON profiles(preferred_locale);
CREATE INDEX idx_profiles_business ON profiles(is_business);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_i18n_updated_at BEFORE UPDATE ON product_i18n
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'RFX-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                        LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, created_at)
  VALUES (NEW.id, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- =====================================================
-- VIEWS (Useful queries)
-- =====================================================

-- Product catalog with brand/category names
CREATE VIEW product_catalog AS
SELECT
  p.*,
  b.name AS brand_name,
  b.slug AS brand_slug,
  c.name AS category_name,
  c.slug AS category_slug
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id;

-- Order summary with customer info
CREATE VIEW order_summary AS
SELECT
  o.*,
  COUNT(oi.id) AS item_count,
  p.first_name || ' ' || p.last_name AS customer_full_name
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN profiles p ON o.user_id = p.id
GROUP BY o.id, p.first_name, p.last_name;
```

---

## 🔒 Row Level Security Policies

File: `/supabase/migrations/002_rls_policies.sql`

```sql
-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES (Catalog Data)
-- =====================================================

-- Brands: Public read
CREATE POLICY "Brands are viewable by everyone"
  ON brands FOR SELECT
  USING (is_active = true);

-- Categories: Public read
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (is_active = true);

-- Products: Public read (only active)
CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

-- Product i18n: Public read
CREATE POLICY "Product translations are viewable by everyone"
  ON product_i18n FOR SELECT
  USING (true);

-- =====================================================
-- USER-SPECIFIC POLICIES
-- =====================================================

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Carts: Users can manage their own carts
CREATE POLICY "Users can view own carts"
  ON carts FOR SELECT
  USING (auth.uid() = user_id OR session_id = current_setting('request.session_id', true));

CREATE POLICY "Users can insert own carts"
  ON carts FOR INSERT
  WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can update own carts"
  ON carts FOR UPDATE
  USING (auth.uid() = user_id OR session_id = current_setting('request.session_id', true));

CREATE POLICY "Users can delete own carts"
  ON carts FOR DELETE
  USING (auth.uid() = user_id OR session_id = current_setting('request.session_id', true));

-- Cart Items: Users can manage items in their carts
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('request.session_id', true))
    )
  );

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('request.session_id', true))
    )
  );

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('request.session_id', true))
    )
  );

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.session_id = current_setting('request.session_id', true))
    )
  );

-- Addresses: Users can manage their own addresses
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Order Items: Users can view items in their orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Settings: Public read for non-sensitive settings
CREATE POLICY "Public settings are viewable"
  ON settings FOR SELECT
  USING (key NOT LIKE 'admin_%' AND key NOT LIKE 'secret_%');

-- =====================================================
-- ADMIN POLICIES (Service Role Only)
-- =====================================================

-- Note: Admin operations should use service_role key, which bypasses RLS
-- Alternatively, implement custom claims for admin users

-- Example admin policy for inventory (if using custom claims):
-- CREATE POLICY "Admins can manage inventory"
--   ON inventory FOR ALL
--   USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 🔄 Database Triggers for Typesense Sync

File: `/supabase/migrations/003_typesense_triggers.sql`

```sql
-- Function to notify about product changes for Typesense sync
CREATE OR REPLACE FUNCTION notify_product_change()
RETURNS TRIGGER AS $$
DECLARE
  payload JSON;
BEGIN
  -- Build payload with product data
  IF TG_OP = 'DELETE' THEN
    payload = json_build_object(
      'operation', 'delete',
      'id', OLD.id
    );
  ELSE
    payload = json_build_object(
      'operation', CASE WHEN TG_OP = 'INSERT' THEN 'create' ELSE 'update' END,
      'id', NEW.id,
      'data', row_to_json(NEW)
    );
  END IF;

  -- Send notification to webhook
  PERFORM pg_notify('product_changed', payload::text);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger on product insert/update/delete
CREATE TRIGGER product_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION notify_product_change();

-- Similar trigger for product_i18n
CREATE OR REPLACE FUNCTION notify_product_i18n_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('product_i18n_changed', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_i18n_change_trigger
  AFTER INSERT OR UPDATE ON product_i18n
  FOR EACH ROW
  EXECUTE FUNCTION notify_product_i18n_change();
```

---

## 📝 Sample Data Seeds

File: `/supabase/seed.sql`

```sql
-- Insert sample brands
INSERT INTO brands (name, slug, is_active) VALUES
  ('Dell', 'dell', true),
  ('HP', 'hp', true),
  ('Lenovo', 'lenovo', true),
  ('Apple', 'apple', true),
  ('Asus', 'asus', true),
  ('Acer', 'acer', true);

-- Insert categories
INSERT INTO categories (name, slug, is_active, sort_order) VALUES
  ('Laptops', 'laptops', true, 1),
  ('Business Laptops', 'business-laptops', true, 2),
  ('Gaming Laptops', 'gaming-laptops', true, 3),
  ('Ultrabooks', 'ultrabooks', true, 4);

-- Insert sample products
INSERT INTO products (
  sku, brand_id, category_id, title, slug,
  condition_grade, cpu, ram_gb, storage_gb, storage_type,
  screen_size_inch, screen_resolution,
  price_cents, stock, is_active, is_featured,
  images, specs
) VALUES
  (
    'DELL-LAT-7470-001',
    (SELECT id FROM brands WHERE slug = 'dell'),
    (SELECT id FROM categories WHERE slug = 'business-laptops'),
    'Dell Latitude E7470',
    'dell-latitude-e7470',
    'A',
    'Intel Core i5-6300U',
    8,
    256,
    'SSD',
    14.00,
    '1920x1080',
    49900, -- €499.00
    5,
    true,
    true,
    '{"main": "/images/dell-lat-7470.jpg", "gallery": ["/images/dell-lat-7470-1.jpg", "/images/dell-lat-7470-2.jpg"]}'::jsonb,
    '{"ports": ["USB 3.0 x3", "HDMI", "USB-C"], "weight_kg": 1.5, "warranty_months": 12}'::jsonb
  );

-- Insert Dutch translation
INSERT INTO product_i18n (product_id, locale, title, description) VALUES
  (
    (SELECT id FROM products WHERE sku = 'DELL-LAT-7470-001'),
    'nl',
    'Dell Latitude E7470 - Refurbished',
    'Professionele zakelijke laptop met krachtige Intel i5 processor, ideaal voor kantoorwerk en thuiswerken.'
  );

-- Insert settings
INSERT INTO settings (key, value, description) VALUES
  ('shipping_methods', '{"standard": {"name": "Standard Shipping", "price_cents": 595, "days": "3-5"}, "express": {"name": "Express Shipping", "price_cents": 995, "days": "1-2"}}'::jsonb, 'Available shipping methods'),
  ('vat_rate', '{"NL": 21.00, "BE": 21.00, "DE": 19.00}'::jsonb, 'VAT rates by country'),
  ('free_shipping_threshold_cents', '7500'::jsonb, 'Free shipping above €75'),
  ('currency', '"EUR"'::jsonb, 'Default currency');
```

---

## 🔍 Useful Queries

```sql
-- Get product with all translations
SELECT
  p.*,
  b.name AS brand_name,
  c.name AS category_name,
  jsonb_object_agg(i.locale, i.title) AS translations
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_i18n i ON p.id = i.product_id
WHERE p.slug = 'dell-latitude-e7470'
GROUP BY p.id, b.name, c.name;

-- Get cart with items and product details
SELECT
  c.id AS cart_id,
  ci.id AS cart_item_id,
  ci.quantity,
  ci.unit_price_cents,
  p.title AS product_title,
  p.images->>'main' AS product_image,
  p.stock
FROM carts c
JOIN cart_items ci ON c.id = ci.cart_id
JOIN products p ON ci.product_id = p.id
WHERE c.user_id = auth.uid();

-- Get user's order history
SELECT
  o.id,
  o.order_number,
  o.created_at,
  o.status,
  o.total_cents,
  COUNT(oi.id) AS items_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = auth.uid()
GROUP BY o.id
ORDER BY o.created_at DESC;

-- Low stock alert
SELECT
  p.sku,
  p.title,
  p.stock,
  b.name AS brand
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE p.stock < 3 AND p.is_active = true
ORDER BY p.stock ASC;
```

---

**Schema Version:** 1.0
**Last Updated:** 2025-10-21
**Compatible with:** Supabase PostgreSQL 15+
