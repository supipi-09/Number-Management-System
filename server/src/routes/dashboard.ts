import { Router } from "express";
import {
  getDashboardSummary,
  getDashboardAnalytics,
  getSystemHealth,
} from "../controllers/dashboardController";
import {
  authenticate,
  requireNumberManagerOrAdmin,
  requireAdmin,
} from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Routes accessible by both number managers and admins
router.get("/summary", requireNumberManagerOrAdmin, getDashboardSummary);
router.get("/analytics", requireNumberManagerOrAdmin, getDashboardAnalytics);

// Admin only routes
router.get("/health", requireAdmin, getSystemHealth);

export default router;
