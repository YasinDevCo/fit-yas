import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const {
      firstName,
      lastName,
      username,
      phone,
      age,
      weight,
      height,
      fitnessGoal,
    } = body;

    // Update user by ID (token.sub)
    const updatedUser = await User.findByIdAndUpdate(
      token.sub,
      {
        firstName,
        lastName,
        username,
        phone,
        age,
        weight,
        height,
        fitnessGoal,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
