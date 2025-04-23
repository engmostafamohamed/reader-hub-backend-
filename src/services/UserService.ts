import User from '../models/User.model';
import { IUser } from '../interfaces/User';
import { IAuthResponse } from '../interfaces/AuthResponse';
import { generateOTP,generateToken, hashPassword, comparePassword } from '../utilts/auth';
import { sendOTPByEmail } from '../utilts/emailService';
import { IApiResponse } from '../interfaces/ApiResponse';
import { successResponse, errorResponse } from '../utilts/responseHandler';

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string,
  t: (key: string) => string
): Promise<IApiResponse<IUser | null>> => {
  try {
    const lowerEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: lowerEmail });

    if (existingUser) {
      return errorResponse(t("email_exist"), 400);
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      username: `${firstName} ${lastName}`,
      email: lowerEmail,
      password: hashedPassword,
      role,
      ...(role === 'publisher' && { status: 'pending' })
    });

    const savedUser = await newUser.save();

    // Send OTP after saving user
    await sendOtp(savedUser.email, t);
    return successResponse(
      t("USER_REGISTERED"),
      {
        id: savedUser._id.toString(),
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
      },
      201
    );
  } catch (error: any) {
    if (error.errors) {
      const validationErrors = Object.entries(error.errors).map(([field, err]: any) => ({
        field,
        message: err.message,
      }));

      return errorResponse(t("VALIDATION_FAILED"), 400, validationErrors);
    }

    if (error.code === 11000) {
      return errorResponse(t("email_exist"), 400);
    }

    return errorResponse(t("REGISTRATION_ERROR"), 500);
  }
};

export const loginUser = async (email: string, password: string ,t: (key: string) => string): Promise<IApiResponse<IAuthResponse>> => {
  try {
    const user = await User.findOne({ email }).select('+password +role');

    if (!user || !user.password) {
      return errorResponse(t("INVALID_CREDENTIALS"), 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(t("INVALID_CREDENTIALS"), 401);
    }

    const token = generateToken(user._id.toString(), user.role || 'user');

    return successResponse(t("LOGIN_SUCCESS"), { token }, 200);
  } catch (error) {
    return errorResponse(t("LOGIN_FAILED"), 500);
  }
};

// Send OTP
export const sendOtp = async (email: string, t: (key: string) => string): Promise<IApiResponse<null>> => { 
  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(t("validation.email_not_found"), 404);
  } else if (user.isVerified) {
    return errorResponse(t("validation.email_already_verified"), 400);
  }

  const otpCode = generateOTP();

  user.otp = {
    code: otpCode,
    expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    last_attempt_date: new Date(),
  };

  if (user.role === "publisher" && !user.status) {
    user.status = "pending";
  }

  await user.save();
  // Sending OTP email
  try {
    await sendOTPByEmail(user.email, user.otp.code);
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return errorResponse(t("EMAIL_SENDING_FAILED"), 500);
  }
  return successResponse(t("validation.send_otp"), null, 200);
};


// Verify OTP
export const verifyOtp = async (email: string, otp: string,t: (key: string) => string): Promise<IApiResponse<null>> => {
  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(t("validation.email_not_found"), 404);
  }
  // if (!user.otp) {
  //   console.error("OTP data is missing for this user!");
  // } else {
  //   console.log(user.otp.expires_at < new Date());
  //   console.log(otp);
  //   console.log(user.otp.code);
  //   console.log(user.otp.code !== otp);
  // }
  if (!user.otp || user.otp.code !== otp || user.otp.expires_at < new Date()) {
    return errorResponse(t("validation.invalid_or_expired_otp"), 400);
  }else if(user.isVerified){
    return errorResponse(t("validation.email_already_verified"), 409);
  }
  user.isVerified = true;
  user.otp = undefined; // Clear OTP after verification
  await user.save();
  return successResponse(t("validation.verified_otp"), null, 200);
};

// requestResetPassword
export const requestResetPassword = async (
  email: string,
  t: (key: string) => string
): Promise<IApiResponse<null>> => {
  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(t("validation.email_not_found"), 404);
  }
  const otpCode = generateOTP();
  user.otp = {
    code: otpCode,
    expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10-minute expiry
    last_attempt_date: new Date(),
  };

  await user.save();
  console.log(otpCode);

  // Send OTP via email (implement sendOTPByEmail function)
  await sendOTPByEmail(user.email, user.otp.code);
  return successResponse(t("validation.send_otp"), null, 200);
};

// verify Reset Otp for resetPassword
export const verifyResetOtp = async (
  email: string,
  otp: string,
  t: (key: string) => string
): Promise<IApiResponse<null>> => {
  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(t("validation.email_not_found"), 404);
  }
  if (!user.otp || user.otp.code !== otp || user.otp.expires_at < new Date()) {
    return errorResponse(t("validation.invalid_or_expired_otp"), 400);
  }
  
  user.otp = null; // Clear OTP after verification
  await user.save();

  return successResponse(t("validation.verified_rest_password_otp"), null, 200);
};

// resetPassword
export const resetPassword = async (
  email: string,
  newPassword: string,
  t: (key: string) => string
): Promise<IApiResponse<null>> => {
  const user = await User.findOne({ email });
  if (!user) {
    return errorResponse(t("validation.email_not_found"), 404);
  }
  
  user.password = await hashPassword(newPassword);
  await user.save();
  return successResponse(t("validation.password_reset"), null, 200);
};
