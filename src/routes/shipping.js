import express from 'express';
import {
  calculateShipping,
  getShippingRates,
  validateAddress,
  validatePincode
} from '../controllers/shippingController.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/calculate', validate(schemas.calculateShipping), calculateShipping);
router.get('/rates', getShippingRates);
router.post('/validate-address', validate(schemas.validateAddress), validateAddress);
router.post('/validate-pincode', validatePincode);

export default router;
