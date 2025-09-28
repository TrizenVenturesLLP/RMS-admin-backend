import { Order, OrderItem, Product, User } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    sort = 'createdAt',
    order = 'DESC'
  } = req.query;

  // Build where clause
  const whereClause = {};

  // If user is not admin, only show their orders
  if (req.user.role !== 'admin') {
    whereClause.userId = req.user.id;
  }

  if (status) {
    whereClause.status = status;
  }

  if (paymentStatus) {
    whereClause.paymentStatus = paymentStatus;
  }

  // Calculate pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows: orders } = await Order.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      },
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'sku']
          }
        ]
      }
    ],
    order: [[sort, order.toUpperCase()]],
    limit: parseInt(limit),
    offset,
    distinct: true
  });

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const whereClause = { id };

  // If user is not admin, only show their orders
  if (req.user.role !== 'admin') {
    whereClause.userId = req.user.id;
  }

  const order = await Order.findOne({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
      },
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'sku', 'price']
          }
        ]
      }
    ]
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    data: { order }
  });
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

  // Validate items
  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one item'
    });
  }

  // Get products and validate
  const productIds = items.map(item => item.productId);
  const products = await Product.findAll({
    where: { id: productIds, isActive: true }
  });

  if (products.length !== productIds.length) {
    return res.status(400).json({
      success: false,
      message: 'One or more products not found or inactive'
    });
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    
    if (!product) {
      return res.status(400).json({
        success: false,
        message: `Product ${item.productId} not found`
      });
    }

    if (product.stockQuantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for product ${product.name}`
      });
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      productId: product.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice: itemTotal,
      productName: product.name,
      productSku: product.sku
    });
  }

  // Calculate tax (simplified - 10% tax)
  const taxAmount = subtotal * 0.1;
  const shippingAmount = 0; // Free shipping for now
  const discountAmount = 0; // No discount for now
  const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  // Create order
  const order = await Order.create({
    orderNumber,
    userId: req.user.id,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod,
    subtotal,
    taxAmount,
    shippingAmount,
    discountAmount,
    totalAmount,
    shippingAddress,
    billingAddress,
    notes
  });

  // Create order items
  for (const item of orderItems) {
    await OrderItem.create({
      orderId: order.id,
      ...item
    });
  }

  // Update product stock
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    await product.update({
      stockQuantity: product.stockQuantity - item.quantity
    });
  }

  // Fetch complete order with associations
  const completeOrder = await Order.findByPk(order.id, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'sku']
          }
        ]
      }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order: completeOrder }
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Staff/Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber, notes } = req.body;

  const order = await Order.findByPk(id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const updateData = { status };

  if (trackingNumber) {
    updateData.trackingNumber = trackingNumber;
  }

  if (notes) {
    updateData.notes = notes;
  }

  // Set timestamps for status changes
  if (status === 'shipped') {
    updateData.shippedAt = new Date();
  } else if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  }

  await order.update(updateData);

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { order }
  });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const whereClause = { id };

  // If user is not admin, only allow canceling their own orders
  if (req.user.role !== 'admin') {
    whereClause.userId = req.user.id;
  }

  const order = await Order.findOne({ where: whereClause });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if order can be cancelled
  if (!order.canBeCancelled()) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled in its current status'
    });
  }

  // Restore product stock
  const orderItems = await OrderItem.findAll({
    where: { orderId: order.id },
    include: [
      {
        model: Product,
        as: 'product'
      }
    ]
  });

  for (const item of orderItems) {
    await item.product.update({
      stockQuantity: item.product.stockQuantity + item.quantity
    });
  }

  await order.update({ status: 'cancelled' });

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order }
  });
});

// @desc    Get order items
// @route   GET /api/v1/orders/:id/items
// @access  Private
export const getOrderItems = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const whereClause = { id };

  // If user is not admin, only show their orders
  if (req.user.role !== 'admin') {
    whereClause.userId = req.user.id;
  }

  const order = await Order.findOne({ where: whereClause });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const orderItems = await OrderItem.findAll({
    where: { orderId: order.id },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'slug', 'sku', 'price']
      }
    ]
  });

  res.json({
    success: true,
    data: { orderItems }
  });
});

export default {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderItems
};
