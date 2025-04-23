import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest } from '../interfaces/AuthRequest'
import { body} from "express-validator";

export const authenticate = (req: AuthRequest , res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = decoded 
    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' })
  }
}
// Validation for Login
export const validateLogin = [
  body("email").isEmail().withMessage((value,{req})=>req.t("validation.Invalid_email")),
  body("password").notEmpty().withMessage((value,{req})=>req.t("validation.password_required")),
];

// Validation for Send OTP
export const validateSendOtp = [
  body("email").isEmail().withMessage((value,{req})=>req.t("validation.Invalid_email")),
];
// Validation for Verify OTP
export const validateVerifyOtp = [
  body("email").isEmail().withMessage((value,{req})=>req.t("validation.Invalid_email")),
  body("otp").isLength({ min: 4, max: 6 }).withMessage((value, { req })=> req.t("validation.OTP_must_be_digits")),
];
// Validation for Reset Password
export const validateResetPassword = [
  body("email").isEmail().withMessage((value,{req})=>req.t("validation.Invalid_email")),
  body("new_password").notEmpty().withMessage((value,{req})=>req.t("validation.password_required")),
  body("new_password").isLength({ min: 6 }).withMessage((value, { req }) => req.t("validation.password_length")),
];
