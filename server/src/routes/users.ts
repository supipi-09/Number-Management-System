import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/usersController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateUserCreation } from '../middleware/validation';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.post('/', validateUserCreation, createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;