import { asyncHandler } from '../middleware/errorHandler.js';
import geocodingService from '../services/geocodingService.js';
import pincodeService from '../services/pincodeService.js';

// @desc    Calculate shipping cost for an address
// @route   POST /api/v1/shipping/calculate
// @access  Public
export const calculateShipping = asyncHandler(async (req, res) => {
  const { address, orderValue = 0 } = req.body;

  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Address is required'
    });
  }

  try {
    console.log(`🚚 Calculating shipping for address: ${address}, order value: ₹${orderValue}`);
    
    const shippingData = await geocodingService.getShippingCost(address, orderValue);
    
    res.status(200).json({
      success: true,
      data: {
        shippingCost: shippingData.shippingCost,
        distance: shippingData.distance,
        duration: shippingData.duration,
        coordinates: shippingData.coordinates,
        shopLocation: shippingData.shopLocation,
        fallback: shippingData.fallback || false,
        orderValue,
        freeShippingThreshold: 999
      }
    });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    
    // Return fallback shipping data
    const fallbackData = geocodingService.getFallbackShippingCost(address, orderValue);
    
    res.status(200).json({
      success: true,
      data: {
        ...fallbackData,
        warning: 'Using fallback shipping calculation due to geocoding service unavailability'
      }
    });
  }
});

// @desc    Get shipping rates for different methods
// @route   GET /api/v1/shipping/rates
// @access  Public
export const getShippingRates = asyncHandler(async (req, res) => {
  const { address, orderValue = 0 } = req.query;

  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Address is required'
    });
  }

  try {
    const shippingData = await geocodingService.getShippingCost(address, orderValue);
    const baseShipping = shippingData.shippingCost;
    
    // Different shipping methods with multipliers
    const shippingRates = {
      standard: {
        name: 'Standard Shipping',
        cost: baseShipping,
        estimatedDays: '5-7 business days',
        description: 'Regular delivery service'
      },
      express: {
        name: 'Express Shipping',
        cost: Math.round(baseShipping * 1.5),
        estimatedDays: '2-3 business days',
        description: 'Faster delivery service'
      },
      overnight: {
        name: 'Overnight Delivery',
        cost: Math.round(baseShipping * 2),
        estimatedDays: '1 business day',
        description: 'Next day delivery (if available)'
      }
    };

    res.status(200).json({
      success: true,
      data: {
        shippingRates,
        distance: shippingData.distance,
        coordinates: shippingData.coordinates,
        shopLocation: shippingData.shopLocation,
        fallback: shippingData.fallback || false,
        orderValue,
        freeShippingThreshold: 999
      }
    });
  } catch (error) {
    console.error('Shipping rates error:', error);
    
    // Return fallback rates
    const fallbackData = geocodingService.getFallbackShippingCost(address, orderValue);
    const baseShipping = fallbackData.shippingCost;
    
    const fallbackRates = {
      standard: {
        name: 'Standard Shipping',
        cost: baseShipping,
        estimatedDays: '5-7 business days',
        description: 'Regular delivery service'
      },
      express: {
        name: 'Express Shipping',
        cost: Math.round(baseShipping * 1.5),
        estimatedDays: '2-3 business days',
        description: 'Faster delivery service'
      },
      overnight: {
        name: 'Overnight Delivery',
        cost: Math.round(baseShipping * 2),
        estimatedDays: '1 business day',
        description: 'Next day delivery (if available)'
      }
    };

    res.status(200).json({
      success: true,
      data: {
        shippingRates: fallbackRates,
        distance: null,
        coordinates: null,
        shopLocation: fallbackData.shopLocation,
        fallback: true,
        orderValue,
        freeShippingThreshold: 999,
        warning: 'Using fallback shipping rates due to geocoding service unavailability'
      }
    });
  }
});

// @desc    Validate address
// @route   POST /api/v1/shipping/validate-address
// @access  Public
export const validateAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Address is required'
    });
  }

  try {
    const coordinates = await geocodingService.geocodeAddress(address);
    
    res.status(200).json({
      success: true,
      data: {
        valid: true,
        coordinates,
        formattedAddress: coordinates.display_name
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: {
        valid: false,
        coordinates: null,
        formattedAddress: null,
        error: error.message
      }
    });
  }
});

// @desc    Validate pincode and get shipping info
// @route   POST /api/v1/shipping/validate-pincode
// @access  Public
export const validatePincode = asyncHandler(async (req, res) => {
  const { pincode, orderValue = 0 } = req.body;

  if (!pincode) {
    return res.status(400).json({
      success: false,
      message: 'Pincode is required'
    });
  }

  try {
    console.log(`📮 Validating pincode: ${pincode}`);
    
    // Validate pincode format
    if (!pincodeService.isValidPincode(pincode)) {
      return res.status(200).json({
        success: true,
        data: {
          valid: false,
          pincode,
          coordinates: null,
          zone: null,
          shippingCost: null,
          error: 'Invalid pincode format. Must be 6 digits.'
        }
      });
    }

    // Get pincode information
    const pincodeInfo = await pincodeService.getPincodeInfo(pincode);
    
    if (pincodeInfo.isValid) {
      // Calculate shipping cost
      const shippingData = pincodeService.calculateShippingByPincode(pincode, orderValue);
      
      res.status(200).json({
        success: true,
        data: {
          valid: true,
          pincode,
          coordinates: pincodeInfo.coordinates,
          zone: pincodeInfo.zone,
          shippingCost: shippingData.shippingCost,
          distance: shippingData.distance,
          duration: shippingData.duration,
          method: 'pincode-based',
          confidence: 'high'
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          valid: false,
          pincode,
          coordinates: null,
          zone: null,
          shippingCost: null,
          error: pincodeInfo.error
        }
      });
    }
  } catch (error) {
    console.error('Pincode validation error:', error);
    
    res.status(200).json({
      success: true,
      data: {
        valid: false,
        pincode,
        coordinates: null,
        zone: null,
        shippingCost: null,
        error: 'Pincode validation service unavailable'
      }
    });
  }
});

export default {
  calculateShipping,
  getShippingRates,
  validateAddress,
  validatePincode
};
