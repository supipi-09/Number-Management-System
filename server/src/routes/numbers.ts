import { Router } from "express";
import multer from "multer";
import {
  getNumbers,
  getNumber,
  createNumber,
  updateNumber,
  deleteNumber,
  importNumbers,
  getNumberStats,
} from "../controllers/numbersController";
import {
  authenticate,
  requireAdmin,
  requireNumberManagerOrAdmin,
} from "../middleware/auth";
import {
  validateNumberCreation,
  validateNumberUpdate,
} from "../middleware/validation";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// Routes accessible by both number managers and admins
router.get("/", requireNumberManagerOrAdmin, getNumbers);
router.get("/stats/summary", requireNumberManagerOrAdmin, getNumberStats);
router.get("/:id", requireNumberManagerOrAdmin, getNumber);
router.put(
  "/:id",
  requireNumberManagerOrAdmin,
  validateNumberUpdate,
  updateNumber
);

// Admin only routes
router.post("/", requireAdmin, validateNumberCreation, createNumber);
router.post("/import", requireAdmin, upload.single("file"), importNumbers);
router.delete("/:id", requireAdmin, deleteNumber);

export default router;
