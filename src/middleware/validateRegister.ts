import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationError } from "express-validator";
import { AuthRequest } from "../interfaces/AuthRequest";

// const allowedRoles = ["client", "author", "publisher", "admin"];
const allowedRoles = ["client","publisher"];

export const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage((value, { req }) => req.t("validation.email_required"))
    .bail()
    .isEmail()
    .withMessage((value, { req }) => req.t("validation.email_invalid")),

  body("password")
    .notEmpty()
    .withMessage((value, { req }) => req.t("validation.password_required"))
    .bail()
    .isLength({ min: 6 })
    .withMessage((value, { req }) => req.t("validation.password_length")),

  body("firstName")
    .notEmpty()
    .withMessage((value, { req }) => req.t("validation.firstName_required")),

  body("lastName")
    .notEmpty()
    .withMessage((value, { req }) => req.t("validation.lastName_required")),

  body("role")
    .notEmpty()
    .withMessage((value, { req }) => req.t("validation.role_required"))
    .bail()
    .isIn(allowedRoles)
    .withMessage((value, { req }) => req.t("validation.role_invalid")), // Custom error for invalid role
];

export const handleValidationErrors = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: (err as any).path || (err as any).param || "unknown", 
      message: req.t(err.msg) || err.msg,
    }));

    res.status(400).json({
      success: false,
      statusCode: 400,
      errors: errorMessages,
    });

    return; //Ensure function exits after sending response
  }

  next(); // Proceed to next middleware if no validation errors
};

