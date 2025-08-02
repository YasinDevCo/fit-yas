import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    age: { type: Number },
    weight: { type: Number }, // kg
    height: { type: Number }, // cm
    fitnessGoal: { type: String }, // هدف ورزشی کاربر

    password: { type: String, required: true },

    profileImage: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },

    // آماری
    totalWorkouts: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 }, // چند روز پیاپی
    totalTime: { type: Number, default: 0 }, // برحسب دقیقه
    avgPerWeek: { type: Number, default: 0 }, // تمرین در هفته
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
