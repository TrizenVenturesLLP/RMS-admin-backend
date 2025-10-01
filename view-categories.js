import { sequelize, Category } from './src/models/index.js';
import { testConnection } from './src/config/database.js';

const viewCategories = async () => {
  try {
    console.log('🔍 Fetching category data...\n');
    
    await testConnection();
    
    // Query 1: Summary by level
    console.log('📊 CATEGORY SUMMARY BY LEVEL:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const [levelSummary] = await sequelize.query(`
      SELECT 
        level,
        category_type,
        COUNT(*) as count,
        string_agg(name, ', ' ORDER BY "sortOrder", name) as sample_names
      FROM categories
      GROUP BY level, category_type
      ORDER BY level, category_type;
    `);
    
    console.table(levelSummary);
    
    // Query 2: Main menu items
    console.log('\n📌 LEVEL 1 - MAIN MENU ITEMS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const mainMenuItems = await Category.findAll({
      where: { level: 1 },
      order: [['sortOrder', 'ASC']],
      attributes: ['id', 'name', 'slug', 'categoryType', 'sortOrder']
    });
    
    console.table(mainMenuItems.map(c => ({
      name: c.name,
      slug: c.slug,
      type: c.categoryType,
      sort: c.sortOrder
    })));
    
    // Query 3: Brand categories
    console.log('\n🏍️  LEVEL 2 - BIKE BRANDS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const brands = await Category.findAll({
      where: { 
        level: 2, 
        categoryType: 'bike_brand'
      },
      order: [['sortOrder', 'ASC']],
      attributes: ['id', 'name', 'slug'],
      include: [{
        model: Category,
        as: 'children',
        attributes: ['id', 'name']
      }]
    });
    
    brands.forEach(brand => {
      console.log(`${brand.name} (${brand.children?.length || 0} models)`);
    });
    
    // Query 4: Accessory types
    console.log('\n\n🔧 LEVEL 2 - ACCESSORY TYPES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const accessoryTypes = await Category.findAll({
      where: { 
        level: 2, 
        categoryType: 'accessory_type'
      },
      order: [['sortOrder', 'ASC']],
      attributes: ['id', 'name', 'slug'],
      include: [{
        model: Category,
        as: 'children',
        attributes: ['id', 'name']
      }]
    });
    
    accessoryTypes.forEach(type => {
      console.log(`${type.name} (${type.children?.length || 0} products)`);
    });
    
    // Query 5: Sample YAMAHA models
    console.log('\n\n📋 SAMPLE: YAMAHA BIKE MODELS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const yamaha = await Category.findOne({
      where: { slug: 'yamaha' },
      include: [{
        model: Category,
        as: 'children',
        attributes: ['name', 'slug', 'sortOrder'],
        order: [['sortOrder', 'ASC']]
      }]
    });
    
    if (yamaha && yamaha.children) {
      console.table(yamaha.children.map(m => ({
        model: m.name,
        slug: m.slug
      })));
    }
    
    // Query 6: Full tree for one branch
    console.log('\n🌲 SAMPLE TREE: Shop by Bike → YAMAHA → (models)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const shopByBike = await Category.findOne({
      where: { slug: 'shop-by-bike' },
      include: [{
        model: Category,
        as: 'children',
        attributes: ['name', 'slug'],
        limit: 3,
        include: [{
          model: Category,
          as: 'children',
          attributes: ['name', 'slug'],
          limit: 5
        }]
      }]
    });
    
    if (shopByBike) {
      console.log(`${shopByBike.name}`);
      shopByBike.children?.forEach(brand => {
        console.log(`  └── ${brand.name}`);
        brand.children?.forEach(model => {
          console.log(`      └── ${model.name}`);
        });
        if (brand.children && brand.children.length > 5) {
          console.log(`      └── ... (${brand.children.length - 5} more models)`);
        }
      });
    }
    
    // Query 7: Database statistics
    console.log('\n\n📈 DATABASE STATISTICS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const [stats] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COUNT(*) FROM categories WHERE level = 1) as main_menu_items,
        (SELECT COUNT(*) FROM categories WHERE level = 2) as brands_and_types,
        (SELECT COUNT(*) FROM categories WHERE level = 3) as models_and_groups,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM product_categories) as product_category_links,
        (SELECT COUNT(*) FROM product_attributes) as product_attributes,
        (SELECT COUNT(*) FROM tags) as total_tags;
    `);
    
    console.table(stats[0]);
    
    // Query 8: View using the helper view
    console.log('\n🔍 USING HELPER VIEW (v_category_tree):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const [treeView] = await sequelize.query(`
      SELECT 
        name,
        level,
        path_string,
        product_count
      FROM v_category_tree
      WHERE level <= 2
      ORDER BY level, path_string
      LIMIT 20;
    `);
    
    console.table(treeView);
    
    console.log('\n✅ Data viewing complete!\n');
    console.log('💡 API Endpoints:');
    console.log('   - GET /api/v1/categories/tree');
    console.log('   - GET /api/v1/categories');
    console.log('   - GET /api/v1/categories/:id');
    console.log('   - GET /api/v1/categories/:id/products\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

viewCategories();

