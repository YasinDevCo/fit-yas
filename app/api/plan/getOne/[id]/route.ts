import { connectDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth/next";  // دقت کن مسیر
import { NextResponse } from "next/server";
import Plan from "@/models/Plan";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request, context: { params: { id: string } }) {
  await connectDB();

  // به این شکل session بگیر
  const session = await getServerSession({ req, ...authOptions });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plan = await Plan.findOne({
      _id: context.params.id,
      userId: session.user.id,
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ plan });
  } catch (error) {
        console.error(error);
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}
