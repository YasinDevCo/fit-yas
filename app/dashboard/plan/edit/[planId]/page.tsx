"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dumbbell,
  User,
  Plus,
  ArrowLeft,
  ArrowRight,
  Target,
  Calendar,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";


interface Exercise {
  id: number;
  name: string;
  sets: string;
  reps: string;
  weight?: string;
  restTime?: string;
  notes?: string;
}

interface PlanDay {
  dayOfWeek: number;
  exercises: Exercise[];
}

interface PlanData {
  name: string;
  description?: string;
  type: string;
  days: PlanDay[];
}
export default function EditPlanPage() {
  const router = useRouter();
  const { planId } = useParams();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [workoutType, setWorkoutType] = useState("bodybuilding");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [exercises, setExercises] = useState<{ [key: string]: Exercise[] }>({});
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addExercise = (day: string) => {
    const newExercise = {
      id: Date.now(),
      name: "",
      sets: "",
      reps: "",
      weight: "",
      restTime: "",
      notes: "",
    };
    setExercises((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newExercise],
    }));
  };

  const updateExercise = (
    day: string,
    exerciseId: number,
    field: string,
    value: string
  ) => {
    setExercises((prev) => ({
      ...prev,
      [day]: prev[day]?.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  const removeExercise = (day: string, exerciseId: number) => {
    setExercises((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((ex) => ex.id !== exerciseId) || [],
    }));
  };

 useEffect(() => {
  const fetchPlan = async () => {
    if (!planId) return setLoading(false);
    try {
      const res = await fetch(`/api/plan/getOne/${planId}`);
      if (!res.ok) throw new Error("Failed to fetch plan");

      const data: { plan: PlanData } = await res.json();

      setPlanName(data.plan.name || "");
      setPlanDescription(data.plan.description || "");
      setWorkoutType(data.plan.type || "");

      const dayNames = data.plan.days.map((d) => weekDays[d.dayOfWeek]);
      setSelectedDays(dayNames);

      const loadedExercises: { [key: string]: Exercise[] } = {};
      data.plan.days.forEach((day) => {
        const dayName = weekDays[day.dayOfWeek];
        loadedExercises[dayName] = day.exercises.map((ex, idx) => ({
          id: Date.now() + idx,
          name: ex.name,
          sets: ex.sets.toString(),
          reps: ex.reps.toString(),
          weight: ex.weight?.toString() || "",
          restTime: ex.restTime?.toString() || "",
          notes: ex.notes || "",
        }));
      });
      setExercises(loadedExercises);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchPlan();
}, [planId, weekDays]);

  const savePlan = async () => {
    const hasExercises = Object.values(exercises).some(
      (dayExercises) => dayExercises.length > 0
    );
    if (!hasExercises) {
      alert("Please add at least one exercise to your plan.");
      return;
    }

    try {
      const formattedDays = selectedDays.map((day) => ({
        dayOfWeek: weekDays.indexOf(day),
        exercises: (exercises[day] || []).map((ex) => ({
          name: ex.name,
          sets: parseInt(ex.sets),
          reps: parseInt(ex.reps),
          weight: ex.weight ? parseFloat(ex.weight) : undefined,
          restTime: ex.restTime ? parseInt(ex.restTime) : undefined,
          note: ex.notes,
        })),
      }));
      console.log(formattedDays);

      const res = await fetch(`/api/plan/edit/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: planName,
          type: workoutType,
          days: formattedDays,
          description: planDescription,
        }),
      });
      console.log(res);

      if (!res.ok) throw new Error("Failed to save plan");

      // Toast
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = planId
        ? "Workout plan updated successfully!"
        : "Workout plan created successfully!";
      document.body.appendChild(toast);

      setTimeout(() => {
        document.body.removeChild(toast);
        router.push("/dashboard/plan");
      }, 1500);
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("An error occurred while saving your plan.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading plan...
      </div>
    );
  }

  // Step 1: Plan Details
  if (currentStep === 1) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-bold text-gray-900">
            Edit Workout Plan{" "}
          </h3>
          <p className="text-gray-600">Step 1: Plan Details & Type</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="planName"
                  className="text-sm font-medium text-gray-700"
                >
                  Plan Name *
                </Label>
                <Input
                  id="planName"
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., Strength Training Plan"
                  className="border-2 border-gray-200 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="planDescription"
                  className="text-sm font-medium text-gray-700"
                >
                  Description (Optional)
                </Label>
                <textarea
                  id="planDescription"
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="Describe your workout plan goals and focus areas..."
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Workout Type
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setWorkoutType("bodybuilding")}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      workoutType === "bodybuilding"
                        ? "border-orange-500 bg-orange-50 text-orange-700 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-center">
                      <Dumbbell className="h-12 w-12 mx-auto mb-3" />
                      <span className="font-semibold text-lg">
                        Bodybuilding
                      </span>
                      <p className="text-sm mt-2 opacity-75">
                        Weight training with equipment
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setWorkoutType("calisthenics")}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      workoutType === "calisthenics"
                        ? "border-orange-500 bg-orange-50 text-orange-700 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-center">
                      <User className="h-12 w-12 mx-auto mb-3" />
                      <span className="font-semibold text-lg">
                        Calisthenics
                      </span>
                      <p className="text-sm mt-2 opacity-75">
                        Bodyweight exercises
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button
            onClick={() => router.push("/dashboard/plan")}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={() => setCurrentStep(2)}
            disabled={!planName.trim()}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Select workout days
  if (currentStep === 2) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-bold text-gray-900">
            Create New Workout Plan
          </h3>
          <p className="text-gray-600">Step 2: Select Workout Days</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Choose Your Workout Days
                </h4>
                <p className="text-gray-600">
                  Select the days you want to work out each week
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weekDays.map((day) => (
                  <label
                    key={day}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="w-5 h-5 text-orange-600 border-2 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-700 font-medium group-hover:text-orange-600 transition-colors">
                      {day}
                    </span>
                  </label>
                ))}
              </div>

              {selectedDays.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-medium">
                    Selected: {selectedDays.length} day
                    {selectedDays.length > 1 ? "s" : ""} per week
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDays.map((day) => (
                      <span
                        key={day}
                        className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button
            onClick={() => setCurrentStep(1)}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(3)}
            disabled={selectedDays.length === 0}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Add exercises
  if (currentStep === 3) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-bold text-gray-900">
            Create New Workout Plan
          </h3>
          <p className="text-gray-600">Step 3: Add Exercises for Each Day</p>
        </div>

        <div className="space-y-6">
          {selectedDays.map((day) => (
            <Card key={day}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Target className="mr-2 h-5 w-5 text-orange-500" />
                    {day}
                  </CardTitle>
                  <Button
                    onClick={() => addExercise(day)}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exercises[day]?.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="p-4 border-2 border-gray-200 rounded-lg space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Exercise Name *
                          </Label>
                          <Input
                            type="text"
                            placeholder="e.g., Bench Press"
                            value={exercise.name}
                            onChange={(e) =>
                              updateExercise(
                                day,
                                exercise.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 focus:border-orange-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Sets *
                          </Label>
                          <Input
                            type="number"
                            placeholder="3"
                            value={exercise.sets}
                            onChange={(e) =>
                              updateExercise(
                                day,
                                exercise.id,
                                "sets",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 focus:border-orange-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Reps *
                          </Label>
                          <Input
                            type="text"
                            placeholder="8-12"
                            value={exercise.reps}
                            onChange={(e) =>
                              updateExercise(
                                day,
                                exercise.id,
                                "reps",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 focus:border-orange-500"
                          />
                        </div>
                        {workoutType === "bodybuilding" && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Weight
                            </Label>
                            <Input
                              type="text"
                              placeholder="80kg"
                              value={exercise.weight}
                              onChange={(e) =>
                                updateExercise(
                                  day,
                                  exercise.id,
                                  "weight",
                                  e.target.value
                                )
                              }
                              className="border-2 border-gray-200 focus:border-orange-500"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Rest Time (seconds)
                          </Label>
                          <Input
                            type="number"
                            placeholder="90"
                            value={exercise.restTime}
                            onChange={(e) =>
                              updateExercise(
                                day,
                                exercise.id,
                                "restTime",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 focus:border-orange-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Notes
                          </Label>
                          <Input
                            type="text"
                            placeholder="Focus on form"
                            value={exercise.notes}
                            onChange={(e) =>
                              updateExercise(
                                day,
                                exercise.id,
                                "notes",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 focus:border-orange-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => removeExercise(day, exercise.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove Exercise
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!exercises[day] || exercises[day].length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No exercises added yet</p>
                      <p className="text-sm">
                        Click &quot;Add Exercise&quot; to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={() => setCurrentStep(2)}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={savePlan}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Target className="mr-2 h-4 w-4" />
            Save Changes{" "}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
