// lib/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("✅ MongoDB connected",process.env.DATABASE_URL as string);
  } catch (err) {
    console.error("❌ MongoDB connection error:",process.env.DATABASE_URL as string ,err);
    process.exit(1);
  }
};


//  await connectDB();
