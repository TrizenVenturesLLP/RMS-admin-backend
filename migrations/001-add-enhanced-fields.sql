-- ============================================================================
-- Migration 001: Add Enhanced Fields for HT Exhaust-Style E-commerce
-- ============================================================================
-- Description: Adds new columns to categories and products tables to support:
--   - Multi-level category hierarchy with type tracking
--   - Product compatibility with bike models
--   - Enhanced product metadata
--   - Installation and warranty info
-- ============================================================================

-- ============================================================================
-- PART 1: ENHANCE CATEGORIES TABLE
-- ============================================================================

-- Add hierarchy and classification fields
ALTER TABLE categories ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS category_type VARCHAR(50);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_visible_in_menu BOOLEAN DEFAULT TRUE;

-- Add UI/display fields
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon VARCHAR(255);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_image VARCHAR(500);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS featured_order INTEGER;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(category_type);
CREATE INDEX IF NOT EXISTS idx_categories_visible_menu ON categories(is_visible_in_menu);

-- Update existing categories to set level based on parentId (Sequelize uses camelCase)
UPDATE categories 
SET level = 1 
WHERE "parentId" IS NULL AND level IS NULL;

UPDATE categories 
SET level = 2 
WHERE "parentId" IS NOT NULL 
  AND "parentId" IN (SELECT id FROM categories WHERE "parentId" IS NULL)
  AND level IS NULL;

-- Comments for documentation
COMMENT ON COLUMN categories.level IS 'Category depth: 1=Main Menu, 2=Brand/Type, 3=Model/Sub-type, 4=Product Group';
COMMENT ON COLUMN categories.category_type IS 'Category classification: main_menu, bike_brand, bike_model, accessory_type, product_group';
COMMENT ON COLUMN categories.is_visible_in_menu IS 'Show in main navigation menu';
COMMENT ON COLUMN categories.icon IS 'Icon URL or icon class for menu display';
COMMENT ON COLUMN categories.banner_image IS 'Banner image for category page header';
COMMENT ON COLUMN categories.featured_order IS 'Order for featuring on homepage (NULL = not featured)';

-- ============================================================================
-- PART 2: ENHANCE PRODUCTS TABLE
-- ============================================================================

-- Add vendor/manufacturer fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS vendor_name VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(100);

-- Add product classification fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS accessory_category VARCHAR(50);

-- Add compatibility tracking (CRITICAL for motorcycle parts!)
ALTER TABLE products ADD COLUMN IF NOT EXISTS compatible_bikes JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS compatible_models JSONB;

-- Add product status flags
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_combo BOOLEAN DEFAULT FALSE;

-- Add installation info
ALTER TABLE products ADD COLUMN IF NOT EXISTS installation_type VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS installation_guide_url VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS installation_video_url VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS installation_time_minutes INTEGER;

-- Add warranty and material info
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_period VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS material VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS color VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS finish VARCHAR(50);

-- Add flexible specifications
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB;

-- Add visibility scheduling
ALTER TABLE products ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_from TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS available_until TIMESTAMP;

-- Add internal tracking
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku_internal VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);

-- Add product features (bullet points)
ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT[];

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_compatible_bikes ON products USING GIN(compatible_bikes);
CREATE INDEX IF NOT EXISTS idx_products_compatible_models ON products USING GIN(compatible_models);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_accessory_category ON products(accessory_category);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_name);
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_published_at ON products(published_at);
CREATE INDEX IF NOT EXISTS idx_products_specifications ON products USING GIN(specifications);

-- Comments for documentation
COMMENT ON COLUMN products.vendor_name IS 'Vendor/supplier name (e.g., HITECH, htexhaust)';
COMMENT ON COLUMN products.product_type IS 'Product category: protection, touring, performance, auxiliary, etc.';
COMMENT ON COLUMN products.accessory_category IS 'Accessory classification for filtering';
COMMENT ON COLUMN products.compatible_bikes IS 'JSON array of compatible bike models: ["AEROX 155", "RAY ZR"]';
COMMENT ON COLUMN products.compatible_models IS 'JSON array of compatible bike full names';
COMMENT ON COLUMN products.installation_type IS 'Installation difficulty: DIY, Professional Required, Easy, Moderate, Complex';
COMMENT ON COLUMN products.installation_time_minutes IS 'Estimated installation time in minutes';
COMMENT ON COLUMN products.warranty_period IS 'Warranty duration (e.g., "1 Year", "Lifetime", "6 Months")';
COMMENT ON COLUMN products.material IS 'Primary material: Stainless Steel, Aluminum, Plastic, etc.';
COMMENT ON COLUMN products.finish IS 'Surface finish: Powder Coated, Chrome, Anodized, etc.';
COMMENT ON COLUMN products.specifications IS 'Flexible JSON for additional specs: {"thread_size": "M8", "pipe_diameter": "51mm"}';
COMMENT ON COLUMN products.published_at IS 'When product was/will be published (for scheduling)';
COMMENT ON COLUMN products.available_from IS 'Product availability start date (pre-orders)';
COMMENT ON COLUMN products.available_until IS 'Product availability end date (seasonal/discontinued)';
COMMENT ON COLUMN products.features IS 'Array of product feature bullet points for display';

-- ============================================================================
-- PART 3: ENHANCE BRANDS TABLE
-- ============================================================================

-- Add brand classification
ALTER TABLE brands ADD COLUMN IF NOT EXISTS brand_type VARCHAR(50);
ALTER TABLE brands ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS featured_order INTEGER;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS banner_image VARCHAR(500);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_brands_type ON brands(brand_type);
CREATE INDEX IF NOT EXISTS idx_brands_featured ON brands(is_featured) WHERE is_featured = TRUE;

-- Comments
COMMENT ON COLUMN brands.brand_type IS 'Brand classification: bike_manufacturer, accessory_brand, vendor';
COMMENT ON COLUMN brands.is_featured IS 'Feature this brand on homepage';
COMMENT ON COLUMN brands.featured_order IS 'Display order for featured brands';

-- ============================================================================
-- PART 4: UPDATE EXISTING DATA (SMART DEFAULTS)
-- ============================================================================

-- Set installation_type for existing products based on product name patterns
UPDATE products 
SET installation_type = 'DIY' 
WHERE installation_type IS NULL;

-- Set warranty_period default
UPDATE products 
SET warranty_period = '1 Year' 
WHERE warranty_period IS NULL;

-- Set published_at to created_at for existing products
UPDATE products 
SET published_at = "createdAt" 
WHERE published_at IS NULL AND "isActive" = TRUE;

-- Set brand_type for brands (default to accessory_brand)
UPDATE brands 
SET brand_type = 'accessory_brand' 
WHERE brand_type IS NULL;

-- ============================================================================
-- PART 5: CREATE HELPER FUNCTION FOR CATEGORY LEVEL CALCULATION
-- ============================================================================

-- Function to calculate and update category levels recursively
CREATE OR REPLACE FUNCTION update_category_levels()
RETURNS void AS $$
DECLARE
  current_level INTEGER := 1;
  rows_updated INTEGER;
BEGIN
  -- Reset all levels
  UPDATE categories SET level = NULL;
  
  -- Set root level
  UPDATE categories SET level = 1 WHERE "parentId" IS NULL;
  
  -- Loop through levels until no more updates
  LOOP
    current_level := current_level + 1;
    
    UPDATE categories c
    SET level = current_level
    WHERE c."parentId" IN (
      SELECT id FROM categories WHERE level = current_level - 1
    )
    AND c.level IS NULL;
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;
  END LOOP;
  
  RAISE NOTICE 'Category levels updated. Max level: %', current_level - 1;
END;
$$ LANGUAGE plpgsql;

-- Run the function to set levels
SELECT update_category_levels();

-- ============================================================================
-- PART 6: DATA VALIDATION CONSTRAINTS
-- ============================================================================

-- Ensure level is valid
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_category_level') THEN
    ALTER TABLE categories ADD CONSTRAINT chk_category_level CHECK (level >= 1 AND level <= 10);
  END IF;
END $$;

-- Ensure installation_time is reasonable
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_installation_time') THEN
    ALTER TABLE products ADD CONSTRAINT chk_installation_time CHECK (
      installation_time_minutes IS NULL OR 
      (installation_time_minutes >= 0 AND installation_time_minutes <= 1440)
    );
  END IF;
END $$;

-- Ensure dates are logical
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_product_availability_dates') THEN
    ALTER TABLE products ADD CONSTRAINT chk_product_availability_dates CHECK (
      available_until IS NULL OR 
      available_from IS NULL OR 
      available_until >= available_from
    );
  END IF;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Migration 001 completed successfully!';
  RAISE NOTICE 'Added enhanced fields to categories, products, and brands tables.';
  RAISE NOTICE 'Created indexes for performance.';
  RAISE NOTICE 'Updated category levels automatically.';
  RAISE NOTICE '============================================================================';
END $$;

-- Show summary
SELECT 
  'Categories' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT level) as distinct_levels,
  MAX(level) as max_level
FROM categories
UNION ALL
SELECT 
  'Products' as table_name,
  COUNT(*) as total_rows,
  COUNT(*) FILTER (WHERE "isActive" = TRUE) as active_count,
  COUNT(*) FILTER (WHERE "isFeatured" = TRUE) as featured_count
FROM products;

