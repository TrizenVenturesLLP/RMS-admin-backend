import { asyncHandler } from '../middleware/errorHandler.js';

// Mock payment data (in production, this would be stored in database)
let payments = [];
let paymentConfirmations = [];

// @desc    Create a new payment request
// @route   POST /api/v1/payments/create
// @access  Public
export const createPayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    amount,
    currency = 'INR',
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items
  } = req.body;

  if (!orderId || !amount || !customerName || !customerEmail) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: orderId, amount, customerName, customerEmail'
    });
  }

  try {
    console.log(`💳 Creating payment for order: ${orderId}, amount: ₹${amount}`);
    
    const paymentId = `PAY-${Date.now()}`;
    const upiId = '7013038373@okbizaxis'; // Your actual UPI ID
    const businessName = 'RidersMotoShop';
    
    // Generate UPI deeplink
    const upiParams = new URLSearchParams({
      pa: upiId,
      pn: businessName,
      am: amount.toString(),
      cu: currency,
      tn: `Order #${orderId}`
    });
    const upiLink = `upi://pay?${upiParams.toString()}`;
    
    // Generate QR code data
    const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=${currency}&tn=${encodeURIComponent(`Order #${orderId}`)}`;
    
    const payment = {
      paymentId,
      orderId,
      amount,
      currency,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      upiId,
      businessName,
      upiLink,
      qrData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
    };
    
    // Store payment (in production, save to database)
    payments.push(payment);
    
    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment request'
    });
  }
});

// @desc    Confirm payment manually
// @route   POST /api/v1/payments/confirm
// @access  Public
export const confirmPayment = asyncHandler(async (req, res) => {
  const {
    paymentId,
    orderId,
    amount,
    paymentMethod = 'UPI',
    transactionId,
    screenshot,
    notes
  } = req.body;

  if (!paymentId || !orderId || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: paymentId, orderId, amount'
    });
  }

  try {
    console.log(`✅ Confirming payment: ${paymentId} for order: ${orderId}`);
    
    // Find the payment
    const paymentIndex = payments.findIndex(p => p.paymentId === paymentId);
    if (paymentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const payment = payments[paymentIndex];
    
    // Verify amount matches
    if (payment.amount !== amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match order amount'
      });
    }
    
    // Update payment status
    payments[paymentIndex] = {
      ...payment,
      status: 'completed',
      confirmedAt: new Date().toISOString(),
      transactionId,
      paymentMethod,
      notes
    };
    
    // Store confirmation
    const confirmation = {
      paymentId,
      orderId,
      amount,
      paymentMethod,
      transactionId,
      screenshot,
      notes,
      confirmedAt: new Date().toISOString()
    };
    
    paymentConfirmations.push(confirmation);
    
    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentId,
        orderId,
        status: 'completed',
        confirmedAt: confirmation.confirmedAt
      }
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment'
    });
  }
});

// @desc    Get payment status
// @route   GET /api/v1/payments/status/:paymentId
// @access  Public
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = payments.find(p => p.paymentId === paymentId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Check if payment has expired
    const now = new Date();
    const expiresAt = new Date(payment.expiresAt);
    
    if (now > expiresAt && payment.status === 'pending') {
      payment.status = 'expired';
    }
    
    res.status(200).json({
      success: true,
      data: {
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt,
        expiresAt: payment.expiresAt,
        confirmedAt: payment.confirmedAt
      }
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    });
  }
});

// @desc    Get all payments (Admin only)
// @route   GET /api/v1/payments
// @access  Private (Admin)
export const getAllPayments = asyncHandler(async (req, res) => {
  try {
    // In production, add admin authentication check here
    
    const paymentsWithConfirmations = payments.map(payment => {
      const confirmation = paymentConfirmations.find(c => c.paymentId === payment.paymentId);
      return {
        ...payment,
        confirmation
      };
    });
    
    res.status(200).json({
      success: true,
      data: {
        payments: paymentsWithConfirmations,
        total: payments.length,
        pending: payments.filter(p => p.status === 'pending').length,
        completed: payments.filter(p => p.status === 'completed').length,
        expired: payments.filter(p => p.status === 'expired').length
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments'
    });
  }
});

// @desc    Get payment configuration
// @route   GET /api/v1/payments/config
// @access  Public
export const getPaymentConfig = asyncHandler(async (req, res) => {
  try {
    const config = {
      upiId: '7013038373@okbizaxis', // Your actual UPI ID
      businessName: 'RidersMotoShop',
      supportedApps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'],
      currency: 'INR',
      timeout: 300000, // 5 minutes
      qrCodeUrl: '/api/v1/payments/qr', // Endpoint to generate QR codes
      instructions: [
        'Open your UPI app (Google Pay, PhonePe, Paytm)',
        'Scan the QR code or enter UPI ID manually',
        'Enter the exact amount shown',
        'Complete the payment',
        'Click "I\'ve Paid" to confirm'
      ]
    };
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Get payment config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment configuration'
    });
  }
});

export default {
  createPayment,
  confirmPayment,
  getPaymentStatus,
  getAllPayments,
  getPaymentConfig
};
