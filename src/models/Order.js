import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50]
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow guest orders
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('stripe', 'paypal', 'bank_transfer', 'cash_on_delivery'),
    allowNull: true
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
    allowNull: false,
    validate: {
      len: [3, 3]
    }
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false
  },
  billingAddress: {
    type: DataTypes.JSON,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

// Associations
Order.associate = (models) => {
  // Many-to-one relationship with user
  Order.belongsTo(models.User, {
    as: 'user',
    foreignKey: 'userId',
    onDelete: 'SET NULL'
  });
  
  // One-to-many relationship with order items
  Order.hasMany(models.OrderItem, {
    as: 'items',
    foreignKey: 'orderId',
    onDelete: 'CASCADE'
  });
  
  // Many-to-many relationship with products through order items
  Order.belongsToMany(models.Product, {
    through: models.OrderItem,
    as: 'products',
    foreignKey: 'orderId',
    otherKey: 'productId'
  });
};

// Instance methods
Order.prototype.generateOrderNumber = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

Order.prototype.calculateTotal = function() {
  return this.subtotal + this.taxAmount + this.shippingAmount - this.discountAmount;
};

Order.prototype.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.status);
};

Order.prototype.canBeRefunded = function() {
  return ['delivered', 'shipped'].includes(this.status) && this.paymentStatus === 'paid';
};

export default Order;
