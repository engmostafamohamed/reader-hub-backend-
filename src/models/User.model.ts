import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../interfaces/User";

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema: Schema<IUserDocument> = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["client", "author", "publisher", "admin"], 
      required: true,
    },
    status: { 
      type: String, 
      enum: ["pending", "active", "inactive"], 
      required: function (this: IUserDocument) { return this.role === "publisher"; },
      default: function (this: IUserDocument) { return this.role === "publisher" ? "pending" : undefined; }
    },
    otp: {
      code: { type: String, default: null },
      expires_at: { type: Date, default: null },
      attempts_today: { type: Number, default: 0 },
      last_attempt_date: { type: Date, default: null },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);
export default User;
