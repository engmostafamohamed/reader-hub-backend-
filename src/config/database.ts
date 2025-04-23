import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing in environment variables!");
}

if (!DB_NAME) {
  throw new Error("DB_NAME is missing in environment variables!");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    console.log(`Successfully connected to MongoDB: ${DB_NAME} (${process.env.NODE_ENV})`);
  } catch (error) {
    console.error(`MongoDB connection failed:`, error);
    process.exit(1);
  }
};

export default connectDB;
