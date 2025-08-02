"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Calendar,
  Clock,
  CheckCircle,
  Target,
  TrendingUp,
  Award,
  Flame,
} from "lucide-react";
import Link from "next/link";

export default function WorkoutPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get current day in English
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
    return days[selectedDate.getDay()];
  };

  // Sample workout schedule based on plans
  const workoutSchedule = {
    Saturday: {
      planName: "Strength Training Plan",
      exercises: [
        { name: "Bench Press", sets: 4, reps: 8, weight: "80kg" },
        { name: "Incline Dumbbell Press", sets: 3, reps: 15, weight: null },
        { name: "Dips", sets: 3, reps: 12, weight: null },
      ],
      duration: "45 min",
      completed: false,
      difficulty: "Hard",
    },
    Monday: {
      planName: "Strength Training Plan",
      exercises: [
        { name: "Squats", sets: 4, reps: 10, weight: "100kg" },
        { name: "Deadlift", sets: 3, reps: 6, weight: "120kg" },
        { name: "Lunges", sets: 3, reps: 12, weight: "60kg" },
      ],
      duration: "50 min",
      completed: true,
      difficulty: "Hard",
    },
    Wednesday: {
      planName: "Strength Training Plan",
      exercises: [
        { name: "Pull-ups", sets: 3, reps: 8, weight: null },
        { name: "Barbell Rows", sets: 4, reps: 10, weight: "70kg" },
        { name: "Bicep Curls", sets: 3, reps: 12, weight: "30kg" },
      ],
      duration: "40 min",
      completed: false,
      difficulty: "Medium",
    },
    Sunday: {
      planName: "Cardio Plan",
      exercises: [
        { name: "Running", sets: 1, reps: "20 min", weight: null },
        { name: "Burpees", sets: 3, reps: 15, weight: null },
        { name: "Jumping Jacks", sets: 3, reps: 30, weight: null },
      ],
      duration: "35 min",
      completed: false,
      difficulty: "Medium",
    },
  };

  const todayWorkout =
    workoutSchedule[getCurrentDay() as keyof typeof workoutSchedule];

  // Weekly stats
  const weeklyStats = {
    completedWorkouts: 3,
    totalWorkouts: 5,
    totalTime: "2h 15m",
    streak: 4,
    caloriesBurned: 1250,
    avgDuration: 43,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Workout Execution
        </h3>
        <p className="text-gray-600 text-lg">
          Execute your scheduled workouts based on date and time
        </p>
      </div>

      {/* Today's Date and Workout */}
      <Card className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-orange-200 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="mr-3 h-6 w-6 text-orange-500" />
                Today's Workout - {getCurrentDay()}
              </CardTitle>
              <p className="text-gray-600 mt-2 text-lg">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {todayWorkout && (
                <>
                  <div className="text-center">
                    <Clock className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-700">
                      {todayWorkout.duration}
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <p
                      className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                        todayWorkout.difficulty
                      )}`}
                    >
                      {todayWorkout.difficulty}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {todayWorkout ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-1">
                    {todayWorkout.planName}
                  </h4>
                  <p className="text-gray-600 flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {todayWorkout.exercises.length} exercises scheduled
                  </p>
                </div>
                {todayWorkout.completed && (
                  <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Completed</span>
                  </div>
                )}
              </div>

              {/* Exercise Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Play className="h-4 w-4 mr-2 text-orange-500" />
                  Today Exercises:
                </h5>
                <div className="grid gap-3">
                  {todayWorkout.exercises.slice(0, 3).map((exercise, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">
                          {exercise.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center space-x-2">
                        <span className="bg-white px-2 py-1 rounded text-xs">
                          {exercise.sets} × {exercise.reps}
                        </span>
                        {exercise.weight && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                            {exercise.weight}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={todayWorkout.completed}
              >
                <Link href="/dashboard/workout/today">
                  <Play className="mr-3 h-5 w-5" />
                  {todayWorkout.completed
                    ? "Workout Completed"
                    : "Start Workout"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-gray-400" />
              </div>
              <h4 className="font-semibold text-xl text-gray-900 mb-2">
                Rest Day
              </h4>
              <p className="text-gray-600 text-lg">
                No workout scheduled for today
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Take time to recover and prepare for tomorrow
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 mb-1">
              {weeklyStats.completedWorkouts}
            </div>
            <p className="text-green-700 text-sm font-medium">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {weeklyStats.totalWorkouts}
            </div>
            <p className="text-blue-700 text-sm font-medium">Total This Week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {weeklyStats.totalTime}
            </div>
            <p className="text-purple-700 text-sm font-medium">Total Time</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {weeklyStats.streak}
            </div>
            <p className="text-orange-700 text-sm font-medium">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600 mb-1">
              {weeklyStats.caloriesBurned}
            </div>
            <p className="text-red-700 text-sm font-medium">Calories</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {weeklyStats.avgDuration}
            </div>
            <p className="text-indigo-700 text-sm font-medium">Avg Minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Calendar className="mr-3 h-6 w-6 text-blue-500" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(workoutSchedule).map(([day, workout]) => (
              <div
                key={day}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      workout.completed ? "bg-green-500" : "bg-orange-500"
                    } shadow-sm`}
                  ></div>
                  <div>
                    <span className="font-semibold text-gray-900 text-lg">
                      {day}
                    </span>
                    <p className="text-gray-600">{workout.planName}</p>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {workout.exercises.length} exercises
                    </p>
                    <p className="text-xs text-gray-500">{workout.duration}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      workout.difficulty
                    )}`}
                  >
                    {workout.difficulty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
        >
          <Link href="/dashboard/workout/history">
            <Calendar className="mr-3 h-6 w-6 text-blue-500" />
            <div className="text-left">
              <div className="font-semibold text-blue-900">Workout History</div>
              <div className="text-sm text-blue-600">
                View past workouts and progress
              </div>
            </div>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100"
        >
          <Link href="/dashboard/plan">
            <Target className="mr-3 h-6 w-6 text-purple-500" />
            <div className="text-left">
              <div className="font-semibold text-purple-900">Manage Plans</div>
              <div className="text-sm text-purple-600">
                Create and edit workout plans
              </div>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
