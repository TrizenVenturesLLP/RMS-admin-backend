import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole,
  deactivateUser,
  activateUser
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin, requireStaff } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Staff/Admin routes
router.get('/', requireStaff, getUsers);
router.get('/:id', requireStaff, getUser);
router.put('/:id', requireStaff, updateUser);
router.put('/:id/role', requireAdmin, updateUserRole);
router.put('/:id/deactivate', requireAdmin, deactivateUser);
router.put('/:id/activate', requireAdmin, activateUser);
router.delete('/:id', requireAdmin, deleteUser);

export default router;
