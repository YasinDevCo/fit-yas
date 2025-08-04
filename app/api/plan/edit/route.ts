import { connectDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Plan from "@/models/Plan";

export async function PATCH(req: Request) {
  console.log("patch")
  await connectDB();
  const session = await getServerSession(authOptions);
  
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { planId, exerciseId, updatedExercise } = await req.json();
    
    if (!planId || !exerciseId || !updatedExercise) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const plan = await Plan.findOne({
      _id: planId,
      userId: session.user.id,
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    let found = false;

    for (const day of plan.days) {
      const idx = day.exercises.findIndex(
        (ex: any) => ex._id.toString() === exerciseId
      );
      if (idx !== -1) {
        // فقط مقدارهای جدید را جایگزین کن
        day.exercises[idx].name = updatedExercise.name || day.exercises[idx].name;
        day.exercises[idx].sets = updatedExercise.sets || day.exercises[idx].sets;
        day.exercises[idx].reps = updatedExercise.reps || day.exercises[idx].reps;
        day.exercises[idx].weight = updatedExercise.weight ?? day.exercises[idx].weight;
        day.exercises[idx].note = updatedExercise.note ?? day.exercises[idx].note;

        found = true;
        break;
      }
    }

    if (!found) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    await plan.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  
}
