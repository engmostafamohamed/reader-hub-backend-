import mongoose from "mongoose";

export interface IUser {
    _id?: string | mongoose.Types.ObjectId; // Allow both string & ObjectId
    username: string;
    email: string;
    password?: string;
    role: "client" | "author" | "publisher" | "admin";
    status?: "pending" | "active" | "inactive";
    otp?: { 
        code: string; 
        expires_at: Date; 
        attempts_today?: number; 
        last_attempt_date?: Date;
    } | null; // OTP is an object, or null when cleared
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
