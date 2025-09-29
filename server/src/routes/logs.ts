import { Router } from "express";
import {
  getLogs,
  getNumberLogs,
  getLogStats,
} from "../controllers/logsController";
import { authenticate, requireNumberManagerOrAdmin } from "../middleware/auth";

const router = Router();

// All routes require authentication and number manager/admin role
router.use(authenticate, requireNumberManagerOrAdmin);

router.get("/", getLogs);
router.get("/stats", getLogStats);
router.get("/number/:number", getNumberLogs);

export default router;
