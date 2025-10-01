# 🗄️ Database Migrations - HT Exhaust Style E-commerce

## Overview

These migrations transform your database from a simple e-commerce structure to a **scalable, multi-category, attribute-based system** matching industry leaders like Amazon, Shopify, and HT Exhaust.

---

## 📋 Migration Files

### **001-add-enhanced-fields.sql**
**Purpose:** Add new columns to existing tables  
**Changes:**
- ✅ **Categories:** level, category_type, is_visible_in_menu, icon, banner_image, featured_order
- ✅ **Products:** compatible_bikes, vendor_name, product_type, installation_type, material, color, finish, warranty_period, specifications, features, and more
- ✅ **Brands:** brand_type, is_featured, featured_order, banner_image
- ✅ Creates indexes for performance
- ✅ Automatically calculates category levels
- ✅ Sets smart defaults for existing data

**Impact:** Enables product compatibility tracking, better categorization, and enhanced product metadata

---

### **002-create-many-to-many-tables.sql**
**Purpose:** Create new tables for advanced e-commerce features  
**Changes:**
- ✅ Creates `product_categories` table (many-to-many relationship)
- ✅ Creates `product_attributes` table (normalized attributes for filtering)
- ✅ Creates `tags` and `product_tags` tables (SEO & marketing)
- ✅ Migrates existing single-category to many-to-many
- ✅ Migrates JSON attributes to normalized structure
- ✅ Migrates JSON tags to normalized structure
- ✅ Creates helper views and triggers
- ✅ Adds automatic usage count tracking

**Impact:** 
- Products can appear in multiple categories
- Advanced filtering (Amazon-style)
- Better SEO and marketing capabilities

---

## 🚀 How to Run Migrations

### **Local Development (With Docker Compose)**

```bash
# 1. Ensure your database is running
cd riders-moto-backend
docker-compose up -d postgres

# 2. Run the enhanced migrations
npm run migrate:enhanced

# Expected output:
# 🚀 Starting database migrations...
# ✅ Database connection established
# 📄 Running migration: 001-add-enhanced-fields.sql
# ✅ Migration 001-add-enhanced-fields.sql completed successfully
# 📄 Running migration: 002-create-many-to-many-tables.sql
# ✅ Migration 002-create-many-to-many-tables.sql completed successfully
# 🎉 All migrations completed successfully!
```

### **Production (CapRover)**

```bash
# 1. Connect to your production environment
# 2. Run the production migration
npm run migrate:enhanced:prod

# Or via CapRover CLI:
caprover run --appName rmsadminbackend -- npm run migrate:enhanced:prod
```

### **Manual SQL Execution**

If you prefer to run SQL directly:

```bash
# Connect to PostgreSQL
psql -U postgres -d riders_moto_shop

# Run migration 001
\i migrations/001-add-enhanced-fields.sql

# Run migration 002
\i migrations/002-create-many-to-many-tables.sql
```

---

## 📊 What Changes After Migration

### **Before Migration:**
```sql
-- One product → One category
products
├── categoryId (single UUID)
└── attributes (JSON)

categories
└── parentId (hierarchy only)
```

### **After Migration:**
```sql
-- One product → Multiple categories
product_categories
├── product_id
├── category_id
└── is_primary (marks main category)

-- Normalized attributes for filtering
product_attributes
├── attribute_name ("Color", "Material")
└── attribute_value ("Black", "Steel")

-- Enhanced categories
categories
├── level (1, 2, 3, 4)
├── category_type ('bike_brand', 'bike_model')
└── is_visible_in_menu

-- Enhanced products
products
├── compatible_bikes (["AEROX 155", "MT 15"])
├── vendor_name ("HITECH")
├── product_type ("protection")
├── material ("Stainless Steel")
└── specifications (JSON)
```

---

## 🔍 Verify Migration Success

### **Check Table Existence:**
```sql
-- Run this query to verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'product_categories',
  'product_attributes',
  'tags',
  'product_tags'
)
ORDER BY table_name;

-- Expected result: 4 rows
```

### **Check Data Migration:**
```sql
-- Verify product-category relationships were migrated
SELECT COUNT(*) FROM product_categories;
-- Should match your product count (all products moved to many-to-many)

-- Check category levels were calculated
SELECT level, COUNT(*) as count 
FROM categories 
GROUP BY level 
ORDER BY level;
-- Should show: Level 1 (main menu), Level 2 (brands), etc.

-- Verify attributes were migrated
SELECT COUNT(*) FROM product_attributes;
-- Should show migrated JSON attributes
```

### **Check Views:**
```sql
-- View products with all their categories
SELECT * FROM v_product_categories LIMIT 10;

-- View category tree with product counts
SELECT * FROM v_category_tree WHERE level <= 2;
```

---

## 🔄 Rollback (If Needed)

### **Rollback Migration 002:**
```sql
-- Drop new tables
DROP TABLE IF EXISTS product_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS product_attributes CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;

-- Drop views
DROP VIEW IF EXISTS v_product_categories;
DROP VIEW IF EXISTS v_product_attributes_pivot;
DROP VIEW IF EXISTS v_category_tree;

-- Drop functions
DROP FUNCTION IF EXISTS migrate_product_attributes();
DROP FUNCTION IF EXISTS migrate_product_tags();
DROP FUNCTION IF EXISTS update_tag_usage_count();
```

### **Rollback Migration 001:**
```sql
-- Remove added columns from categories
ALTER TABLE categories 
  DROP COLUMN IF EXISTS level,
  DROP COLUMN IF EXISTS category_type,
  DROP COLUMN IF EXISTS is_visible_in_menu,
  DROP COLUMN IF EXISTS icon,
  DROP COLUMN IF EXISTS banner_image,
  DROP COLUMN IF EXISTS featured_order;

-- Remove added columns from products
ALTER TABLE products 
  DROP COLUMN IF EXISTS vendor_name,
  DROP COLUMN IF EXISTS product_type,
  DROP COLUMN IF EXISTS compatible_bikes,
  -- ... (add all new columns)
```

**⚠️ Warning:** Rollback will lose migrated data!

---

## 📈 Performance Impact

### **Indexes Created:**
- ✅ 25+ new indexes for fast queries
- ✅ GIN indexes for JSONB fields (compatible_bikes, specifications)
- ✅ Composite indexes for common query patterns
- ✅ Partial indexes for filtered queries (is_filterable = TRUE)

### **Query Performance:**
- **Before:** Full table scans for attribute filtering
- **After:** Index-based filtering (100x faster with large datasets)

### **Estimated Migration Time:**
- **Small DB (<1000 products):** 10-30 seconds
- **Medium DB (1000-10000 products):** 1-3 minutes
- **Large DB (10000+ products):** 5-15 minutes

---

## 🎯 Next Steps After Migration

1. ✅ **Update Sequelize Models** (Phase 3)
   - Add many-to-many associations
   - Add ProductAttribute model
   - Add Tag model

2. ✅ **Update API Controllers** (Phase 4)
   - Create `/api/v1/categories/tree` endpoint
   - Add attribute filtering to product queries
   - Create filter options endpoint

3. ✅ **Seed Categories** (Phase 5)
   - Run `npm run seed:categories`
   - Import HT Exhaust category structure

4. ✅ **Update Admin Panel** (Phase 6)
   - Multi-select categories in product form
   - Attribute management UI
   - Tag management UI

5. ✅ **Update Frontend** (Phase 7)
   - Dynamic navigation from API
   - Category pages
   - Filter sidebar

---

## 🆘 Troubleshooting

### **Migration fails with "relation does not exist"**
**Solution:** Run the basic migrations first:
```bash
npm run migrate  # Run Sequelize migrations first
npm run migrate:enhanced  # Then run enhanced migrations
```

### **"duplicate key value violates unique constraint"**
**Solution:** Clean up duplicate data before migration:
```sql
-- Find duplicates
SELECT product_id, category_id, COUNT(*) 
FROM product_categories 
GROUP BY product_id, category_id 
HAVING COUNT(*) > 1;
```

### **Migration hangs or takes too long**
**Solution:** Run migrations in smaller batches or increase timeout:
```javascript
// In run-migrations.js, increase timeout:
await sequelize.query(sql, { timeout: 300000 }); // 5 minutes
```

### **"permission denied for table"**
**Solution:** Ensure your database user has proper permissions:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

---

## 📚 Additional Resources

- **Schema Documentation:** See `HTEXHAUST_ANALYSIS_AND_OPTIMAL_SCHEMA.md`
- **Codebase Analysis:** See `CODEBASE_ANALYSIS.md`
- **API Documentation:** Coming in Phase 4
- **Sequelize Models:** Coming in Phase 3

---

## ✅ Migration Checklist

- [ ] Backup production database before migration
- [ ] Run migrations on staging environment first
- [ ] Test data integrity after migration
- [ ] Update Sequelize models to match new schema
- [ ] Update API endpoints
- [ ] Update admin panel UI
- [ ] Update frontend components
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Celebrate! 🎉

---

**Questions or Issues?**  
Refer to `HTEXHAUST_ANALYSIS_AND_OPTIMAL_SCHEMA.md` for detailed schema explanations.

**Last Updated:** Current  
**Migration Version:** 2.0 (HT Exhaust Compatible)

