import { User } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Staff/Admin)
export const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    role,
    isActive,
    search,
    sort = 'createdAt',
    order = 'DESC'
  } = req.query;

  // Build where clause
  const whereClause = {};

  if (role) {
    whereClause.role = role;
  }

  if (isActive !== undefined) {
    whereClause.isActive = isActive === 'true';
  }

  if (search) {
    whereClause[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Calculate pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows: users } = await User.findAndCountAll({
    where: whereClause,
    attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] },
    order: [[sort, order.toUpperCase()]],
    limit: parseInt(limit),
    offset,
    distinct: true
  });

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private (Staff/Admin)
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: { user }
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private (Staff/Admin)
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if email is being changed and if it already exists
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await User.findOne({
      where: { email: updateData.email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
  }

  await user.update(updateData);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user: user.toJSON() }
  });
});

// @desc    Update user role
// @route   PUT /api/v1/users/:id/role
// @access  Private (Admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent changing own role
  if (id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot change your own role'
    });
  }

  await user.update({ role });

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: { user: user.toJSON() }
  });
});

// @desc    Deactivate user
// @route   PUT /api/v1/users/:id/deactivate
// @access  Private (Admin)
export const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent deactivating own account
  if (id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot deactivate your own account'
    });
  }

  await user.update({ isActive: false });

  res.json({
    success: true,
    message: 'User deactivated successfully',
    data: { user: user.toJSON() }
  });
});

// @desc    Activate user
// @route   PUT /api/v1/users/:id/activate
// @access  Private (Admin)
export const activateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  await user.update({ isActive: true });

  res.json({
    success: true,
    message: 'User activated successfully',
    data: { user: user.toJSON() }
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent deleting own account
  if (id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account'
    });
  }

  // Check if user has orders
  const orderCount = await user.countOrders();
  if (orderCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete user with orders. Please deactivate instead.'
    });
  }

  await user.destroy();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

export default {
  getUsers,
  getUser,
  updateUser,
  updateUserRole,
  deactivateUser,
  activateUser,
  deleteUser
};
