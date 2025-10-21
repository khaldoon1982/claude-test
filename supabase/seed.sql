-- =====================================================
-- SAMPLE DATA FOR REFURBX E-COMMERCE
-- =====================================================

-- Insert brands
INSERT INTO brands (name, slug, is_active) VALUES
  ('Dell', 'dell', true),
  ('HP', 'hp', true),
  ('Lenovo', 'lenovo', true),
  ('Apple', 'apple', true),
  ('Asus', 'asus', true),
  ('Acer', 'acer', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug, is_active, sort_order) VALUES
  ('Laptops', 'laptops', true, 1),
  ('Business Laptops', 'business-laptops', true, 2),
  ('Gaming Laptops', 'gaming-laptops', true, 3),
  ('Ultrabooks', 'ultrabooks', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (
  sku, brand_id, category_id, title, slug,
  condition_grade, cpu, ram_gb, storage_gb, storage_type,
  screen_size_inch, screen_resolution,
  price_cents, compare_at_price_cents, stock, is_active, is_featured,
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
    49900,
    69900,
    5,
    true,
    true,
    '{"main": "/images/dell-lat-7470.jpg", "gallery": ["/images/dell-lat-7470-1.jpg", "/images/dell-lat-7470-2.jpg"]}'::jsonb,
    '{"ports": ["USB 3.0 x3", "HDMI", "USB-C"], "weight_kg": 1.5, "warranty_months": 12}'::jsonb
  ),
  (
    'HP-ELITEBOOK-840-G3-001',
    (SELECT id FROM brands WHERE slug = 'hp'),
    (SELECT id FROM categories WHERE slug = 'business-laptops'),
    'HP EliteBook 840 G3',
    'hp-elitebook-840-g3',
    'A-',
    'Intel Core i5-6200U',
    8,
    256,
    'SSD',
    14.00,
    '1920x1080',
    44900,
    64900,
    3,
    true,
    true,
    '{"main": "/images/hp-elitebook-840.jpg", "gallery": []}'::jsonb,
    '{"ports": ["USB 3.0 x3", "HDMI", "DisplayPort"], "weight_kg": 1.46, "warranty_months": 12}'::jsonb
  ),
  (
    'LENOVO-T480-001',
    (SELECT id FROM brands WHERE slug = 'lenovo'),
    (SELECT id FROM categories WHERE slug = 'business-laptops'),
    'Lenovo ThinkPad T480',
    'lenovo-thinkpad-t480',
    'B+',
    'Intel Core i5-8250U',
    8,
    256,
    'SSD',
    14.00,
    '1920x1080',
    54900,
    79900,
    7,
    true,
    false,
    '{"main": "/images/lenovo-t480.jpg", "gallery": []}'::jsonb,
    '{"ports": ["USB 3.1 x2", "USB-C x2", "HDMI"], "weight_kg": 1.58, "warranty_months": 12}'::jsonb
  ),
  (
    'DELL-XPS-13-9360-001',
    (SELECT id FROM brands WHERE slug = 'dell'),
    (SELECT id FROM categories WHERE slug = 'ultrabooks'),
    'Dell XPS 13 9360',
    'dell-xps-13-9360',
    'A',
    'Intel Core i7-7500U',
    16,
    512,
    'NVMe SSD',
    13.30,
    '1920x1080',
    69900,
    99900,
    2,
    true,
    true,
    '{"main": "/images/dell-xps-13.jpg", "gallery": []}'::jsonb,
    '{"ports": ["USB-C x2", "USB 3.0", "microSD"], "weight_kg": 1.2, "warranty_months": 12}'::jsonb
  ),
  (
    'LENOVO-T470-OUTLET-001',
    (SELECT id FROM brands WHERE slug = 'lenovo'),
    (SELECT id FROM categories WHERE slug = 'business-laptops'),
    'Lenovo ThinkPad T470',
    'lenovo-thinkpad-t470-outlet',
    'B',
    'Intel Core i5-7200U',
    8,
    256,
    'SSD',
    14.00,
    '1366x768',
    34900,
    54900,
    4,
    true,
    false,
    '{"main": "/images/lenovo-t470.jpg", "gallery": []}'::jsonb,
    '{"ports": ["USB 3.0 x3", "USB-C", "HDMI"], "weight_kg": 1.67, "warranty_months": 12}'::jsonb
  )
ON CONFLICT (sku) DO NOTHING;

-- Insert Dutch translations for products
INSERT INTO product_i18n (product_id, locale, title, description) VALUES
  (
    (SELECT id FROM products WHERE sku = 'DELL-LAT-7470-001'),
    'nl',
    'Dell Latitude E7470 - Refurbished',
    'Professionele zakelijke laptop met krachtige Intel i5 processor. Ideaal voor kantoorwerk en thuiswerken. Inclusief 12 maanden garantie en gratis verzending.'
  ),
  (
    (SELECT id FROM products WHERE sku = 'HP-ELITEBOOK-840-G3-001'),
    'nl',
    'HP EliteBook 840 G3 - Refurbished',
    'Dunne en lichte business laptop van HP. Perfect voor professionals die veel onderweg zijn. Voorzien van Full HD scherm en snelle SSD.'
  ),
  (
    (SELECT id FROM products WHERE sku = 'LENOVO-T480-001'),
    'nl',
    'Lenovo ThinkPad T480 - Refurbished',
    'Betrouwbare ThinkPad met uitstekende typervaring. Robuuste constructie en lange batterijduur. Ideaal voor intensief zakelijk gebruik.'
  )
ON CONFLICT (product_id, locale) DO NOTHING;

-- Insert English translations
INSERT INTO product_i18n (product_id, locale, title, description) VALUES
  (
    (SELECT id FROM products WHERE sku = 'DELL-LAT-7470-001'),
    'en',
    'Dell Latitude E7470 - Refurbished',
    'Professional business laptop with powerful Intel i5 processor. Perfect for office work and remote working. Includes 12 months warranty and free shipping.'
  ),
  (
    (SELECT id FROM products WHERE sku = 'HP-ELITEBOOK-840-G3-001'),
    'en',
    'HP EliteBook 840 G3 - Refurbished',
    'Thin and light business laptop from HP. Perfect for professionals on the go. Features Full HD display and fast SSD.'
  )
ON CONFLICT (product_id, locale) DO NOTHING;

-- Insert settings
INSERT INTO settings (key, value, description) VALUES
  ('shipping_methods',
   '{"standard": {"name": "Standard Shipping", "price_cents": 595, "days": "3-5"}, "express": {"name": "Express Shipping", "price_cents": 995, "days": "1-2"}}'::jsonb,
   'Available shipping methods'),
  ('vat_rate',
   '{"NL": 21.00, "BE": 21.00, "DE": 19.00}'::jsonb,
   'VAT rates by country'),
  ('free_shipping_threshold_cents',
   '7500'::jsonb,
   'Free shipping above this amount in cents'),
  ('currency',
   '"EUR"'::jsonb,
   'Default currency'),
  ('company_info',
   '{"name": "RefurbX B.V.", "vat": "NL123456789B01", "kvk": "12345678", "email": "info@refurbx.nl", "phone": "+31 20 123 4567"}'::jsonb,
   'Company information')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
