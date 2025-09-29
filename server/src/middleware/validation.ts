import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

export const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

export const validateUserCreation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["admin", "number_manager"])
    .withMessage("Role must be either admin or number manager"),
  handleValidationErrors,
];

export const validateNumberCreation = [
  body("number")
    .trim()
    .notEmpty()
    .withMessage("Number is required")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Please enter a valid phone number"),
  body("serviceType")
    .isIn(["LTE", "IPTL", "FTTH/Copper"])
    .withMessage("Service type must be LTE, IPTL, or FTTH/Copper"),
  body("specialType")
    .optional()
    .isIn(["Elite", "Gold", "Platinum", "Silver", "Standard"])
    .withMessage(
      "Special type must be Elite, Gold, Platinum, Silver, or Standard"
    ),
  body("status")
    .optional()
    .isIn(["Available", "Allocated", "Reserved", "Held", "Quarantined"])
    .withMessage(
      "Status must be Available, Allocated, Reserved, Held, or Quarantined"
    ),
  body("allocatedTo")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Allocated to cannot exceed 100 characters"),
  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Remarks cannot exceed 500 characters"),
  handleValidationErrors,
];

export const validateNumberUpdate = [
  body("status")
    .optional()
    .isIn(["Available", "Allocated", "Reserved", "Held", "Quarantined"])
    .withMessage(
      "Status must be Available, Allocated, Reserved, Held, or Quarantined"
    ),
  body("allocatedTo")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Allocated to cannot exceed 100 characters"),
  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Remarks cannot exceed 500 characters"),
  handleValidationErrors,
];
