import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { hashPassword } from "@/utils/auth";

export async function POST(req: Request) {
  console.log("register");

  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phone,
      age,
      weight,
      height,
      fitnessGoal,
    } = body;

    await connectDB();
    if (!email || !password) {
      return NextResponse.json({ message: "Invalid Data" }, { status: 422 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await hashPassword(password);
    console.log("🔐 Password hashed");

    const newUser = new User({
      firstName: firstName || "",
      lastName: lastName || "",
      username: username || "",
      email,
      password: hashedPassword,
      phone: phone || "",
      age: age || 0,
      weight: weight || 0,
      height: height || 0,
      fitnessGoal: fitnessGoal || "",
    });

    console.log("+ New User -> ", newUser);

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Register error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
