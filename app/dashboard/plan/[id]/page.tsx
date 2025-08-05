"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowLeft, Calendar, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// کامپوننت‌های دیالوگ ساده
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IPlanExercises {
  name: string;
  note: string;
  reps: number;
  sets: number;
  _id: string;
  weight?: string | null;
  restTime?: number;
}

interface IPlan {
  _id: string;
  name: string;
  createdAt: string;
  type: string;
  description?: string;
  days: string[];
  totalExercises?: number;
  estimatedDuration?: string;
  exercises: Record<string, IPlanExercises[]>;
}

export default function PlanDetailPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState<IPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  // برای مدال ویرایش تمرین
  const [editingExercise, setEditingExercise] = useState<IPlanExercises | null>(
    null
  );
  const [editedExercise, setEditedExercise] = useState<IPlanExercises | null>(
    null
  );

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/plan/getOne/${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch plan");
        }
        const data = await res.json();

        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const days = data.plan.days.map(
          (day: { dayOfWeek: number }) => dayNames[day.dayOfWeek]
        );
        const exercises: Record<string, IPlanExercises[]> = {};

        data.plan.days.forEach(
          (day: { dayOfWeek: number; exercises: IPlanExercises[] }) => {
            exercises[dayNames[day.dayOfWeek]] = day.exercises;
          }
        );

        const transformedPlan: IPlan = {
          ...data.plan,
          days,
          exercises,
        };

        setPlan(transformedPlan);

        const initialOpenState: Record<string, boolean> = {};
        days.forEach((day: string) => {
          initialOpenState[day] = false;
        });
        setOpenDays(initialOpenState);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching plan");
        }
      }
    };

    fetchPlan();
  }, [id]);

  const toggleDay = (day: string) => {
    setOpenDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // باز کردن مدال ویرایش
  const openEdit = (exercise: IPlanExercises) => {
    setEditingExercise(exercise);
    setEditedExercise(exercise);
  };

  // بستن مدال
  const closeEdit = () => {
    setEditingExercise(null);
    setEditedExercise(null);
  };

  // ذخیره تغییرات تمرین
  const saveEdit = async () => {
    if (!editedExercise || !plan) return;

    await fetch("/api/plan/edit", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId: plan._id,
        exerciseId: editedExercise._id,
        updatedExercise: editedExercise,
      }),
    });

    setPlan((prevPlan) => {
      if (!prevPlan) return prevPlan;

      const updatedExercises = { ...prevPlan.exercises };

      let dayKey = "";
      for (const [day, exercises] of Object.entries(updatedExercises)) {
        if (exercises.find((e) => e._id === editedExercise._id)) {
          dayKey = day;
          break;
        }
      }

      if (!dayKey) return prevPlan;

      updatedExercises[dayKey] = updatedExercises[dayKey].map((e) =>
        e._id === editedExercise._id ? editedExercise : e
      );

      return {
        ...prevPlan,
        exercises: updatedExercises,
      };
    });

    closeEdit();
  };

  const handleEditChange = (
    field: keyof IPlanExercises,
    value: string | number
  ) => {
    if (!editedExercise) return;
    setEditedExercise({
      ...editedExercise,
      [field]: value,
    });
  };

  const deletePlan = () => {
    if (!plan) return;
    if (confirm("Are you sure you want to delete this plan?")) {
      alert(`Plan ${plan.name} deleted`);
      window.location.href = "/dashboard/plan";
    }
  };

  if (loading) return <p className="text-center mt-10">Loading plan...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!plan) return <p className="text-center mt-10">Plan not found</p>;

  const totalExercises =
    plan.totalExercises ||
    Object.values(plan.exercises).reduce(
      (sum, exercises) => sum + exercises.length,
      0
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/dashboard/plan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Link>
        </Button>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
          <p className="text-gray-600">View and manage plan details</p>
        </div>
        <div></div>
      </div>

      {/* Plan Overview */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-orange-500" />
            Plan Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {plan.type}
              </div>
              <p className="text-gray-600 text-sm">Plan Type</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {totalExercises}
              </div>
              <p className="text-gray-600 text-sm">Total Exercises</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {plan.days.length}
              </div>
              <p className="text-gray-600 text-sm">Days per Week</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {plan.estimatedDuration || "N/A"}
              </div>
              <p className="text-gray-600 text-sm">Duration</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-gray-700">
              {plan.description || "No description available."}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">
                Created: {new Date(plan.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">Workout Days:</span>
              {plan.days.map((day) => (
                <span
                  key={day}
                  className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Details by Day */}
      <div className="space-y-4">
        {Object.entries(plan.exercises).map(([day, dayExercises]) => (
          <Card key={day}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleDay(day)}
            >
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                {day}
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {dayExercises.length} exercises
                </span>
                <span className="ml-2 text-gray-400 text-sm select-none">
                  {openDays[day] ? "▲" : "▼"}
                </span>
              </CardTitle>
            </CardHeader>
            {openDays[day] && (
              <CardContent>
                <div className="space-y-3">
                  {dayExercises.map((exercise) => (
                    <div
                      key={exercise._id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {exercise.name}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span className="bg-white px-2 py-1 rounded text-xs">
                              {exercise.sets} sets
                            </span>
                            <span className="bg-white px-2 py-1 rounded text-xs">
                              {exercise.reps} reps
                            </span>
                            {exercise.weight && (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                {exercise.weight}
                              </span>
                            )}
                            {exercise.restTime !== undefined && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                Rest: {exercise.restTime}s
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEdit(exercise)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {exercise.note && (
                        <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> {exercise.note}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button variant="outline" className="flex-1 bg-transparent">
          <Edit className="mr-2 h-4 w-4" />
          Edit Plan
        </Button>
        <Button onClick={deletePlan} variant="destructive" className="flex-1">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Plan
        </Button>
      </div>

      {/* Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This plan is for viewing and management only.
            To execute workouts, go to the <em>Workout section.</em>
          </p>
        </CardContent>
      </Card>

      {/* Edit Exercise Dialog */}
      <Dialog
        open={!!editingExercise}
        onOpenChange={(open) => !open && closeEdit()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          {editedExercise && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedExercise.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  value={editedExercise.sets}
                  onChange={(e) =>
                    handleEditChange("sets", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={editedExercise.reps}
                  onChange={(e) =>
                    handleEditChange("reps", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={editedExercise.weight || ""}
                  onChange={(e) => handleEditChange("weight", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="restTime">Rest Time (seconds)</Label>
                <Input
                  id="restTime"
                  type="number"
                  value={editedExercise.restTime ?? ""}
                  onChange={(e) =>
                    handleEditChange("restTime", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Input
                  id="note"
                  value={editedExercise.note}
                  onChange={(e) => handleEditChange("note", e.target.value)}
                />
              </div>
            </div>
          )}
          {/* FIXME: DialogFooter*/}

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={closeEdit}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
