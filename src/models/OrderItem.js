import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  productVariantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'product_variants',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  productSku: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  variantAttributes: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'order_items',
  timestamps: true
});

// Associations
OrderItem.associate = (models) => {
  // Many-to-one relationship with order
  OrderItem.belongsTo(models.Order, {
    as: 'order',
    foreignKey: 'orderId',
    onDelete: 'CASCADE'
  });
  
  // Many-to-one relationship with product
  OrderItem.belongsTo(models.Product, {
    as: 'product',
    foreignKey: 'productId',
    onDelete: 'CASCADE'
  });
  
  // Many-to-one relationship with product variant
  OrderItem.belongsTo(models.ProductVariant, {
    as: 'variant',
    foreignKey: 'productVariantId',
    onDelete: 'SET NULL'
  });
};

// Hooks
OrderItem.addHook('beforeCreate', (orderItem) => {
  // Calculate total price
  orderItem.totalPrice = orderItem.quantity * orderItem.unitPrice;
});

OrderItem.addHook('beforeUpdate', (orderItem) => {
  // Recalculate total price if quantity or unit price changed
  if (orderItem.changed('quantity') || orderItem.changed('unitPrice')) {
    orderItem.totalPrice = orderItem.quantity * orderItem.unitPrice;
  }
});

export default OrderItem;
