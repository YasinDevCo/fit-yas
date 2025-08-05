import { connectDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import Plan from "@/models/Plan";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plan = await Plan.findOne({ _id: params.id, userId: session.user.id });

    if (!plan) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    await plan.deleteOne();
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
