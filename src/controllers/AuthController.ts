import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser,sendOtp, verifyOtp, requestResetPassword ,verifyResetOtp ,resetPassword,} from '../services/UserService';
import { IApiResponse } from '../interfaces/ApiResponse';
import AppError from '../utilts/AppError';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, role } = req.body;
  const t = req.t;
  

  if (!email || !password || !firstName || !lastName || !role) {
    res.status(400).json({ success: false, statusCode: 400, message: t("missing_fields") });
    return;
  }

  const response: IApiResponse<any> = await registerUser(email, password, firstName, lastName, role, t);
  res.status(response.statusCode).json(response);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const response: IApiResponse<any> = await loginUser(req.body.email, req.body.password,req.t);
  res.status(response.statusCode).json(response);
};

// Send OTP
export const sendOtpController = async (req: Request, res: Response) => {
  const response: IApiResponse<null> = await sendOtp(req.body.email,req.t);
  res.status(response.statusCode).json(response);
};

// Verify OTP
export const verifyOtpController = async (req: Request, res: Response) => {
  const response: IApiResponse<null> = await verifyOtp(req.body.email, req.body.otp,req.t);
  res.status(response.statusCode).json(response);
};

// request Reset Password
export const requestResetPasswordController = async (req: Request, res: Response) => {
  const response: IApiResponse<null> = await requestResetPassword(req.body.email,req.t);
  res.status(response.statusCode).json(response);
};

// verify Reset Otp
export const verifyResetOtpController = async (req: Request, res: Response) => {
  const response: IApiResponse<null> = await verifyResetOtp(req.body.email, req.body.otp,req.t);
  res.status(response.statusCode).json(response);
};

// reset Password
export const resetPasswordController = async (req: Request, res: Response) => {
  const response: IApiResponse<null> = await resetPassword(req.body.email,req.body.new_password,req.t);
  res.status(response.statusCode).json(response);
};