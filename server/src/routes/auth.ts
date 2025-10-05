import { Router } from "express";
import {
  login,
  register,
  getMe,
  updateProfile,
} from "../controllers/authController";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validateLogin, validateUserCreation } from "../middleware/validation";

const router = Router();

// Public routes
router.post("/login", validateLogin, login);

// Protected routes
router.get("/me", authenticate, getMe);
router.put("/update", authenticate, updateProfile);

// Admin only routes
router.post(
  "/register",
  authenticate,
  requireAdmin,
  validateUserCreation,
  register
);

export default router;
