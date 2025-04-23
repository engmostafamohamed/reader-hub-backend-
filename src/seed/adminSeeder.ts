// seed/adminSeeder.ts
import mongoose from "mongoose";
import User from "../models/User.model";
import { hashPassword } from "../utilts/auth";
import dotenv from "dotenv";
dotenv.config();
async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);

  const exists = await User.findOne({ email: "admin@admin.com" });
  if (!exists) {
    await User.create({
      username: "Admin",
      email: "admin@admin.com",
      password: await hashPassword("admin123"),
      isVerified:true,
      role: "admin"
    });
    console.log("Admin created");
  } else {
    console.log("Admin already exists");
  }

  process.exit(0);
}
seed();
