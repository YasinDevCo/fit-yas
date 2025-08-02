import { connectDB } from "@/lib/mongoose"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import Plan from "@/models/Plan"

export async function GET(req: Request) {
  await connectDB()
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const plans = await Plan.find({ userId: session.user.id }).sort({ createdAt: -1 })
    return NextResponse.json({ plans })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
