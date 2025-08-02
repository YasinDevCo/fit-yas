"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  Target,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function TodayWorkoutPage() {
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Get current day workout
  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  const todayWorkout = {
    planName: "Strength Training Plan",
    day: getCurrentDay(),
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    exercises: [
      {
        id: 1,
        name: "Bench Press",
        sets: 4,
        reps: 8,
        weight: "80kg",
        restTime: 120,
        category: "Chest",
      },
      {
        id: 2,
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: 15,
        weight: null,
        restTime: 90,
        category: "Chest",
      },
      {
        id: 3,
        name: "Dips",
        sets: 3,
        reps: 12,
        weight: null,
        restTime: 90,
        category: "Chest",
      },
      {
        id: 4,
        name: "Chest Flyes",
        sets: 3,
        reps: 10,
        weight: "25kg",
        restTime: 90,
        category: "Chest",
      },
      {
        id: 5,
        name: "Push-ups",
        sets: 2,
        reps: 15,
        weight: null,
        restTime: 60,
        category: "Chest",
      },
    ],
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutStarted && !isPaused) {
      interval = setInterval(() => {
        if (isResting && restTime > 0) {
          setRestTime((prev) => prev - 1);
        } else if (isResting && restTime === 0) {
          setIsResting(false);
        } else {
          setWorkoutTime((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutStarted, isResting, restTime, isPaused]);

  const toggleExercise = (exerciseId: number) => {
    setCompletedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );

    // Start rest timer when completing an exercise
    if (!completedExercises.includes(exerciseId)) {
      const exercise = todayWorkout.exercises.find(
        (ex) => ex.id === exerciseId
      );
      if (exercise) {
        setRestTime(exercise.restTime);
        setIsResting(true);
        // Move to next exercise
        const currentIndex = todayWorkout.exercises.findIndex(
          (ex) => ex.id === exerciseId
        );
        if (currentIndex < todayWorkout.exercises.length - 1) {
          setCurrentExercise(currentIndex + 1);
        }
      }
    }
  };

  const startWorkout = () => {
    setIsWorkoutStarted(true);
    setWorkoutTime(0);
    setIsPaused(false);
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const skipRest = () => {
    setRestTime(0);
    setIsResting(false);
  };

  const finishWorkout = () => {
    const completedCount = completedExercises.length;
    const totalCount = todayWorkout.exercises.length;
    const completionRate = Math.round((completedCount / totalCount) * 100);

    // Show completion toast
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 border border-green-400";
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
        </svg>
        <div>
          <div class="font-semibold">Workout Completed! 🎉</div>
          <div class="text-sm opacity-90">${completedCount}/${totalCount} exercises (${completionRate}%)</div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 5000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return (completedExercises.length / todayWorkout.exercises.length) * 100;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
        <Button asChild variant="outline" size="sm" className="bg-white/80">
          <Link href="/dashboard/workout">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workouts
          </Link>
        </Button>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">
            {todayWorkout.planName}
          </h3>
          <p className="text-gray-600 text-sm">{todayWorkout.date}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-orange-600 bg-white/80 px-3 py-1 rounded-full">
            <Clock className="h-4 w-4 mr-2" />
            <span className="font-mono text-sm font-semibold">
              {formatTime(workoutTime)}
            </span>
          </div>
          {isWorkoutStarted && (
            <Button
              onClick={pauseWorkout}
              size="sm"
              variant="outline"
              className="mt-2 bg-white/80"
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && restTime > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <RotateCcw className="h-6 w-6 text-blue-500 animate-spin" />
                <span className="text-blue-700 font-semibold text-lg">
                  Rest Time
                </span>
              </div>
              <div className="text-4xl font-bold text-blue-600 font-mono">
                {formatTime(restTime)}
              </div>
              <Button
                onClick={skipRest}
                variant="outline"
                size="sm"
                className="bg-white/80 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Skip Rest
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-gray-900">
                Workout Progress
              </span>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {completedExercises.length}/{todayWorkout.exercises.length}{" "}
              exercises
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-lg font-bold text-orange-600">
              {Math.round(getProgressPercentage())}%
            </span>
            <span className="text-gray-600 text-sm ml-1">Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Start Workout Button */}
      {!isWorkoutStarted && (
        <Button
          onClick={startWorkout}
          size="lg"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Play className="mr-3 h-6 w-6" />
          Start Workout
        </Button>
      )}

      {/* Exercise List */}
      <div className="space-y-4">
        {todayWorkout.exercises.map((exercise, index) => (
          <Card
            key={exercise.id}
            className={`transition-all duration-300 ${
              completedExercises.includes(exercise.id)
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md"
                : currentExercise === index && isWorkoutStarted
                ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-lg ring-2 ring-orange-200"
                : "hover:shadow-md bg-white"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                        Exercise {index + 1}
                      </span>
                      <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                        {exercise.category}
                      </span>
                    </div>
                    {currentExercise === index &&
                      isWorkoutStarted &&
                      !completedExercises.includes(exercise.id) && (
                        <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full animate-pulse font-medium">
                          Current Exercise
                        </span>
                      )}
                  </div>
                  <h4
                    className={`font-bold text-xl mb-3 ${
                      completedExercises.includes(exercise.id)
                        ? "text-green-800 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {exercise.name}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-white/80 px-3 py-2 rounded-lg border">
                      <div className="text-gray-600 text-xs">Sets</div>
                      <div className="font-bold text-gray-900">
                        {exercise.sets}
                      </div>
                    </div>
                    <div className="bg-white/80 px-3 py-2 rounded-lg border">
                      <div className="text-gray-600 text-xs">Reps</div>
                      <div className="font-bold text-gray-900">
                        {exercise.reps}
                      </div>
                    </div>
                    {exercise.weight && (
                      <div className="bg-orange-100 px-3 py-2 rounded-lg border border-orange-200">
                        <div className="text-orange-600 text-xs">Weight</div>
                        <div className="font-bold text-orange-800">
                          {exercise.weight}
                        </div>
                      </div>
                    )}
                    <div className="bg-blue-100 px-3 py-2 rounded-lg border border-blue-200">
                      <div className="text-blue-600 text-xs">Rest</div>
                      <div className="font-bold text-blue-800">
                        {exercise.restTime}s
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleExercise(exercise.id)}
                  disabled={!isWorkoutStarted}
                  className={`ml-6 p-3 rounded-full transition-all duration-200 ${
                    completedExercises.includes(exercise.id)
                      ? "bg-green-500 text-white shadow-lg scale-110"
                      : isWorkoutStarted
                      ? "bg-gray-200 text-gray-400 hover:bg-gray-300 hover:scale-105"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle className="h-7 w-7" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Finish Workout Button */}
      {isWorkoutStarted && (
        <div className="sticky bottom-4">
          <Button
            onClick={finishWorkout}
            size="lg"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200"
          >
            <Award className="mr-3 h-6 w-6" />
            Finish Workout & Save Progress
          </Button>
        </div>
      )}
    </div>
  );
}
