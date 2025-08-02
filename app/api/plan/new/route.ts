import { connectDB } from "@/lib/mongoose"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import Plan from "@/models/Plan"

export async function POST(req: Request) {

  await connectDB()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const { name, type, days } = body
console.log({name, type, days});

  if (!name || !type || !Array.isArray(days)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  try {
    const newPlan = await Plan.create({
      userId: session.user.id,
      name,
      type,
      days,
    })

    return NextResponse.json({ success: true, plan: newPlan }, { status: 201 })
  } catch (error) {
    console.error("❌ Error saving plan:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
