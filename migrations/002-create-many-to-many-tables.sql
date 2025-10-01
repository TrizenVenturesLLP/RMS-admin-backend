-- ============================================================================
-- Migration 002: Create Many-to-Many Relationships & Normalized Attributes
-- ============================================================================
-- Description: Creates new tables for:
--   - Product-Category many-to-many relationship (multi-category products)
--   - Product attributes (normalized for filtering)
--   - Tags system (for SEO and marketing)
-- ============================================================================

-- Enable UUID extension (required for uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 1: CREATE PRODUCT_CATEGORIES TABLE (MANY-TO-MANY)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  
  -- Relationship Metadata
  is_primary BOOLEAN DEFAULT FALSE, -- Main category for this product
  sort_order INTEGER DEFAULT 0,     -- Display order within category
  
  -- Context-specific overrides (optional)
  category_specific_title VARCHAR(200), -- Different title for this category
  category_specific_description TEXT,   -- Different description for this category
  
  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(product_id, category_id)
);

-- Indexes for performance
CREATE INDEX idx_product_categories_product ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);
CREATE INDEX idx_product_categories_primary ON product_categories(is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_product_categories_sort ON product_categories(category_id, sort_order);

-- Comments
COMMENT ON TABLE product_categories IS 'Many-to-many relationship: Products can belong to multiple categories';
COMMENT ON COLUMN product_categories.is_primary IS 'Designates the main category for the product (used for breadcrumbs, primary navigation)';
COMMENT ON COLUMN product_categories.sort_order IS 'Display order within the category (lower numbers appear first)';
COMMENT ON COLUMN product_categories.category_specific_title IS 'Override product title for this specific category context';

-- Constraint: Each product must have exactly one primary category
CREATE UNIQUE INDEX idx_product_categories_one_primary 
ON product_categories(product_id) 
WHERE is_primary = TRUE;

-- ============================================================================
-- PART 2: MIGRATE EXISTING PRODUCT-CATEGORY DATA
-- ============================================================================

-- Insert existing single-category relationships as primary
INSERT INTO product_categories (product_id, category_id, is_primary, created_at, updated_at)
SELECT 
  id as product_id,
  "categoryId",
  TRUE as is_primary,
  "createdAt",
  "updatedAt"
FROM products 
WHERE "categoryId" IS NOT NULL
ON CONFLICT (product_id, category_id) DO NOTHING;

-- Log migration results
DO $$
DECLARE
  migrated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO migrated_count FROM product_categories;
  RAISE NOTICE 'Migrated % product-category relationships', migrated_count;
END $$;

-- ============================================================================
-- PART 3: CREATE PRODUCT_ATTRIBUTES TABLE (NORMALIZED)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Key
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- Attribute Data
  attribute_name VARCHAR(100) NOT NULL,   -- "Color", "Material", "Bike Model"
  attribute_value VARCHAR(255) NOT NULL,  -- "Black", "Steel", "AEROX 155"
  
  -- Grouping & Display
  attribute_group VARCHAR(50),            -- "Specifications", "Compatibility", "Physical"
  display_order INTEGER DEFAULT 0,        -- Order within group
  
  -- Filtering & Search
  is_filterable BOOLEAN DEFAULT TRUE,     -- Show in filter sidebar?
  is_searchable BOOLEAN DEFAULT TRUE,     -- Include in search index?
  is_visible BOOLEAN DEFAULT TRUE,        -- Show on product page?
  
  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast filtering (CRITICAL for performance!)
CREATE INDEX idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX idx_product_attributes_name ON product_attributes(attribute_name);
CREATE INDEX idx_product_attributes_value ON product_attributes(attribute_value);
CREATE INDEX idx_product_attributes_name_value ON product_attributes(attribute_name, attribute_value);
CREATE INDEX idx_product_attributes_filterable ON product_attributes(is_filterable) WHERE is_filterable = TRUE;
CREATE INDEX idx_product_attributes_group ON product_attributes(attribute_group);

-- Full-text search index for attribute values
CREATE INDEX idx_product_attributes_value_text ON product_attributes USING GIN(to_tsvector('english', attribute_value));

-- Comments
COMMENT ON TABLE product_attributes IS 'Normalized product attributes for advanced filtering (replaces JSON attributes field)';
COMMENT ON COLUMN product_attributes.attribute_name IS 'Attribute key (e.g., Color, Material, Bike Model)';
COMMENT ON COLUMN product_attributes.attribute_value IS 'Attribute value (e.g., Black, Steel, AEROX 155)';
COMMENT ON COLUMN product_attributes.attribute_group IS 'Logical grouping for display (Specifications, Compatibility, Physical)';
COMMENT ON COLUMN product_attributes.is_filterable IS 'Include in filter sidebar (Color: YES, Internal Code: NO)';
COMMENT ON COLUMN product_attributes.is_searchable IS 'Include in product search index';

-- ============================================================================
-- PART 4: MIGRATE JSON ATTRIBUTES TO NORMALIZED TABLE
-- ============================================================================

-- Function to migrate JSON attributes to normalized structure
CREATE OR REPLACE FUNCTION migrate_product_attributes()
RETURNS void AS $$
DECLARE
  product_record RECORD;
  attr_key TEXT;
  attr_value TEXT;
  migrated_count INTEGER := 0;
BEGIN
  -- Loop through products with JSON attributes
  FOR product_record IN 
    SELECT id, attributes::jsonb as attributes
    FROM products 
    WHERE attributes IS NOT NULL 
    AND jsonb_typeof(attributes::jsonb) = 'object'
  LOOP
    -- Loop through each key-value pair in JSON
    FOR attr_key, attr_value IN 
      SELECT key, value::text 
      FROM jsonb_each_text(product_record.attributes::jsonb)
    LOOP
      -- Insert into product_attributes table
      INSERT INTO product_attributes (
        product_id,
        attribute_name,
        attribute_value,
        attribute_group,
        is_filterable
      ) VALUES (
        product_record.id,
        attr_key,
        TRIM(BOTH '"' FROM attr_value),
        'Specifications',
        TRUE
      )
      ON CONFLICT DO NOTHING;
      
      migrated_count := migrated_count + 1;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Migrated % attributes from JSON to normalized table', migrated_count;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_product_attributes();

-- ============================================================================
-- PART 5: CREATE TAGS TABLE (FOR SEO & MARKETING)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Tag Data
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  
  -- Tag Classification
  tag_type VARCHAR(50),  -- 'product_feature', 'bike_type', 'use_case', 'material'
  
  -- Display Customization
  color VARCHAR(7),      -- Hex color for tag badges (#FF0000)
  icon VARCHAR(100),     -- Icon class or URL
  
  -- Tracking
  usage_count INTEGER DEFAULT 0,  -- Number of products using this tag
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_type ON tags(tag_type);
CREATE INDEX idx_tags_usage ON tags(usage_count DESC);

-- Comments
COMMENT ON TABLE tags IS 'Reusable tags for products (SEO, filtering, marketing campaigns)';
COMMENT ON COLUMN tags.tag_type IS 'Tag classification: product_feature, bike_type, use_case, material, brand, etc.';
COMMENT ON COLUMN tags.usage_count IS 'Cached count of products using this tag (updated via trigger)';

-- ============================================================================
-- PART 6: CREATE PRODUCT_TAGS TABLE (MANY-TO-MANY)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(product_id, tag_id)
);

-- Indexes
CREATE INDEX idx_product_tags_product ON product_tags(product_id);
CREATE INDEX idx_product_tags_tag ON product_tags(tag_id);

-- Comments
COMMENT ON TABLE product_tags IS 'Many-to-many: Products can have multiple tags';

-- ============================================================================
-- PART 7: MIGRATE JSON TAGS TO NORMALIZED TABLE
-- ============================================================================

-- Function to migrate JSON tags
CREATE OR REPLACE FUNCTION migrate_product_tags()
RETURNS void AS $$
DECLARE
  product_record RECORD;
  tag_name TEXT;
  tag_id UUID;
  migrated_count INTEGER := 0;
BEGIN
  -- Loop through products with JSON tags
  FOR product_record IN 
    SELECT id, tags::jsonb as tags 
    FROM products 
    WHERE tags IS NOT NULL 
    AND jsonb_typeof(tags::jsonb) = 'array'
  LOOP
    -- Loop through each tag in array
    FOR tag_name IN 
      SELECT jsonb_array_elements_text(product_record.tags::jsonb)
    LOOP
      -- Clean up tag name
      tag_name := TRIM(BOTH '"' FROM tag_name);
      tag_name := TRIM(tag_name);
      
      IF tag_name != '' THEN
        -- Create tag if doesn't exist
        INSERT INTO tags (name, slug)
        VALUES (
          tag_name,
          lower(regexp_replace(tag_name, '[^a-zA-Z0-9]+', '-', 'g'))
        )
        ON CONFLICT (name) DO NOTHING
        RETURNING id INTO tag_id;
        
        -- Get tag_id if it already existed
        IF tag_id IS NULL THEN
          SELECT id INTO tag_id FROM tags WHERE name = tag_name;
        END IF;
        
        -- Link product to tag
        INSERT INTO product_tags (product_id, tag_id)
        VALUES (product_record.id, tag_id)
        ON CONFLICT (product_id, tag_id) DO NOTHING;
        
        migrated_count := migrated_count + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Migrated % product-tag relationships', migrated_count;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_product_tags();

-- ============================================================================
-- PART 8: CREATE TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Trigger to update tag usage_count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tag_usage
AFTER INSERT OR DELETE ON product_tags
FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- Trigger to ensure timestamps are updated
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_product_categories_updated_at
BEFORE UPDATE ON product_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_product_attributes_updated_at
BEFORE UPDATE ON product_attributes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tags_updated_at
BEFORE UPDATE ON tags
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 9: CREATE HELPER VIEWS
-- ============================================================================

-- View: Products with all their categories
CREATE OR REPLACE VIEW v_product_categories AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  p.slug as product_slug,
  p.sku,
  pc.category_id,
  c.name as category_name,
  c.slug as category_slug,
  c.level as category_level,
  pc.is_primary,
  pc.sort_order
FROM products p
JOIN product_categories pc ON p.id = pc.product_id
JOIN categories c ON pc.category_id = c.id
ORDER BY p.name, pc.is_primary DESC, c.level;

-- View: Products with all their attributes (for easy querying)
CREATE OR REPLACE VIEW v_product_attributes_pivot AS
SELECT 
  product_id,
  MAX(CASE WHEN attribute_name = 'Material' THEN attribute_value END) as material,
  MAX(CASE WHEN attribute_name = 'Color' THEN attribute_value END) as color,
  MAX(CASE WHEN attribute_name = 'Finish' THEN attribute_value END) as finish,
  MAX(CASE WHEN attribute_name = 'Bike Model' THEN attribute_value END) as bike_model
FROM product_attributes
GROUP BY product_id;

-- View: Category tree with product counts
CREATE OR REPLACE VIEW v_category_tree AS
WITH RECURSIVE category_tree AS (
  -- Root categories
  SELECT 
    id,
    name,
    slug,
    "parentId" as parent_id,
    level,
    ARRAY[name::VARCHAR] as path,
    name::TEXT as path_string
  FROM categories
  WHERE "parentId" IS NULL
  
  UNION ALL
  
  -- Child categories
  SELECT 
    c.id,
    c.name,
    c.slug,
    c."parentId" as parent_id,
    c.level,
    ct.path || c.name::VARCHAR,
    ct.path_string || ' > ' || c.name
  FROM categories c
  JOIN category_tree ct ON c."parentId" = ct.id
)
SELECT 
  ct.*,
  COUNT(DISTINCT pc.product_id) as product_count
FROM category_tree ct
LEFT JOIN product_categories pc ON ct.id = pc.category_id
GROUP BY ct.id, ct.name, ct.slug, ct.parent_id, ct.level, ct.path, ct.path_string;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
DECLARE
  products_count INTEGER;
  categories_count INTEGER;
  relationships_count INTEGER;
  attributes_count INTEGER;
  tags_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO products_count FROM products;
  SELECT COUNT(*) INTO categories_count FROM categories;
  SELECT COUNT(*) INTO relationships_count FROM product_categories;
  SELECT COUNT(*) INTO attributes_count FROM product_attributes;
  SELECT COUNT(*) INTO tags_count FROM tags;
  
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Migration 002 completed successfully!';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Summary:';
  RAISE NOTICE '  - Products: %', products_count;
  RAISE NOTICE '  - Categories: %', categories_count;
  RAISE NOTICE '  - Product-Category Relationships: %', relationships_count;
  RAISE NOTICE '  - Product Attributes: %', attributes_count;
  RAISE NOTICE '  - Tags: %', tags_count;
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Update Sequelize models to use many-to-many relationships';
  RAISE NOTICE '  2. Update API controllers to query product_categories table';
  RAISE NOTICE '  3. Seed HT Exhaust category structure';
  RAISE NOTICE '  4. Test multi-category product assignment';
  RAISE NOTICE '============================================================================';
END $$;

-- Show sample data
SELECT 'Product-Category Relationships' as info, COUNT(*) as count FROM product_categories
UNION ALL
SELECT 'Normalized Attributes' as info, COUNT(*) as count FROM product_attributes
UNION ALL
SELECT 'Tags' as info, COUNT(*) as count FROM tags
UNION ALL
SELECT 'Product-Tag Relationships' as info, COUNT(*) as count FROM product_tags;

