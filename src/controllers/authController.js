import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

const {
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE
} = process.env;

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    emailVerificationToken
  });

  // Generate JWT token
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Send verification email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - Riders Moto Shop',
      template: 'emailVerification',
      data: {
        name: user.getFullName(),
        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
      }
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't fail registration if email fails
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email for verification.',
    data: {
      user: user.toJSON(),
      token,
      refreshToken
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Validate password
  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  await user.update({ lastLogin: new Date() });

  // Generate JWT token
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      token,
      refreshToken
    }
  });
});

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, profileImage } = req.body;

  const user = await User.findByPk(req.user.id);
  await user.update({
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    phone: phone || user.phone,
    profileImage: profileImage || user.profileImage
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.toJSON()
    }
  });
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.id);

  // Validate current password
  const isCurrentPasswordValid = await user.validatePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  await user.update({ password: newPassword });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await user.update({
    passwordResetToken: resetToken,
    passwordResetExpires: resetExpires
  });

  // Send reset email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset - Riders Moto Shop',
      template: 'passwordReset',
      data: {
        name: user.getFullName(),
        resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      }
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    });
  }

  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    where: {
      passwordResetToken: token,
      passwordResetExpires: {
        [Op.gt]: new Date()
      }
    }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  // Update password and clear reset token
  await user.update({
    password,
    passwordResetToken: null,
    passwordResetExpires: null
  });

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

// @desc    Verify email
// @route   POST /api/v1/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await User.findOne({
    where: { emailVerificationToken: token }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification token'
    });
  }

  await user.update({
    emailVerified: true,
    emailVerificationToken: null
  });

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // In a more sophisticated setup, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout
};
