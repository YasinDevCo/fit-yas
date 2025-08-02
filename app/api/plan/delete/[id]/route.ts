import { connectDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Plan from "@/models/Plan";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planId = context.params.id;

  try {
    const plan = await Plan.findOne({
      _id: planId,
      userId: session.user.id,
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found or access denied" }, { status: 404 });
    }

    await plan.deleteOne();

    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
