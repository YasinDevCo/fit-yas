import { connectDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Plan from "@/models/Plan";
import { Types } from "mongoose";
import { authOptions } from "@/lib/authOptions";
interface Exercise {
  _id: Types.ObjectId; // ← این درستشه
  id: number;
  name: string;
  sets: string;
  reps: string;
  weight?: string;
  restTime?: string;
  notes?: string;
}
// پارامتر دوم به فانکشن PATCH اضافه می‌شه تا planId از URL استخراج بشه
export async function PATCH(
  req: Request,
  { params }: { params: { planId: string } }
) {
  console.log("patch");

  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { exerciseId, updatedExercise } = await req.json();
    const planId = params.planId;

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
        (ex: Exercise) => ex._id.toString() === exerciseId
      );
      if (idx !== -1) {
        // فقط مقدارهای جدید را جایگزین کن
        day.exercises[idx].name =
          updatedExercise.name || day.exercises[idx].name;
        day.exercises[idx].sets =
          updatedExercise.sets || day.exercises[idx].sets;
        day.exercises[idx].reps =
          updatedExercise.reps || day.exercises[idx].reps;
        day.exercises[idx].weight =
          updatedExercise.weight ?? day.exercises[idx].weight;
        day.exercises[idx].note =
          updatedExercise.note ?? day.exercises[idx].note;

        found = true;
        break;
      }
    }

    if (!found) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    await plan.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
