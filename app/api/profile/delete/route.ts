import { connectDB } from "@/lib/mongoose"
import User from "@/models/User"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const deletedUser = await User.findByIdAndDelete(token.sub)

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
