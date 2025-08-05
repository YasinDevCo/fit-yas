"use client";
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   CheckCircle,
//   Plus,
//   Calendar,
//   Play,
//   Target,
//   TrendingUp,
//   Clock,
//   Flame,
//   Activity,
// } from "lucide-react";
// import Link from "next/link";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  // const workoutPlans = [
  //   {
  //     id: 1,
  //     name: "Strength Training Plan",
  //     type: "Bodybuilding",
  //     activeDays: ["Saturday", "Monday", "Wednesday"],
  //     totalExercises: 12,
  //     lastWorkout: "2 days ago",
  //     progress: 75,
  //   },
  //   {
  //     id: 2,
  //     name: "Cardio Plan",
  //     type: "Calisthenics",
  //     activeDays: ["Sunday", "Tuesday", "Thursday"],
  //     totalExercises: 8,
  //     lastWorkout: "1 day ago",
  //     progress: 60,
  //   },
  // ];

  // const todayStats = {
  //   scheduledWorkout: "Strength Training Plan",
  //   exercisesCompleted: 8,
  //   totalExercises: 12,
  //   timeSpent: "35 min",
  //   caloriesBurned: 420,
  // };

  // const weeklyStats = {
  //   workoutsCompleted: 4,
  //   totalWorkouts: 6,
  //   streak: 5,
  //   avgDuration: 42,
  // };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center lg:text-left">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name}! 👋
        </h3>
        <p className="text-gray-600 text-lg">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {weeklyStats.workoutsCompleted}
            </div>
            <p className="text-blue-700 text-sm font-medium">This Week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {weeklyStats.streak}
            </div>
            <p className="text-orange-700 text-sm font-medium">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {weeklyStats.avgDuration}
            </div>
            <p className="text-green-700 text-sm font-medium">Avg Minutes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {todayStats.caloriesBurned}
            </div>
            <p className="text-purple-700 text-sm font-medium">Calories</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Today's Workout */}
      {/* <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Calendar className="mr-3 h-6 w-6 text-orange-500" />
            Today's Workout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h4 className="font-bold text-xl text-gray-900">
                  {todayStats.scheduledWorkout}
                </h4>
                <p className="text-gray-600">
                  Progress: {todayStats.exercisesCompleted}/
                  {todayStats.totalExercises} exercises completed
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="bg-white px-3 py-2 rounded-lg border">
                  <div className="text-gray-600">Time</div>
                  <div className="font-bold">{todayStats.timeSpent}</div>
                </div>
                <div className="bg-white px-3 py-2 rounded-lg border">
                  <div className="text-gray-600">Calories</div>
                  <div className="font-bold">{todayStats.caloriesBurned}</div>
                </div>
              </div>
            </div>

            {/* Progress Bar 
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (todayStats.exercisesCompleted /
                      todayStats.totalExercises) *
                    100
                  }%`,
                }}
              ></div>
            </div>

            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-3"
            >
              <Link href="/dashboard/workout/today">
                <Play className="mr-2 h-5 w-5" />
                Continue Today's Workout
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card> */}

      {/* Your Workout Plans */}
      {/* <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900">
              Your Workout Plans
            </h4>
            <p className="text-gray-600">
              Manage and track your fitness programs
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Link href="/dashboard/plan/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map((plan) => (
            <Card
              key={plan.id}
              className="hover:shadow-lg transition-all duration-200"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Last workout: {plan.lastWorkout}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {plan.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Exercises:</span>
                    <span className="font-medium">{plan.totalExercises}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Active Days:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {plan.activeDays.map((day) => (
                        <span
                          key={day}
                          className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium">{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href={`/dashboard/plan/${plan.id}`}>
                    <Target className="mr-2 h-4 w-4" />
                    View Plan Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
        >
          <Link href="/dashboard/workout">
            <Play className="mr-3 h-6 w-6 text-blue-500" />
            <div className="text-left">
              <div className="font-semibold text-blue-900">Start Workout</div>
              <div className="text-sm text-blue-600">Execute today's plan</div>
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
              <div className="text-sm text-purple-600">Create & edit plans</div>
            </div>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100"
        >
          <Link href="/dashboard/profile">
            <TrendingUp className="mr-3 h-6 w-6 text-green-500" />
            <div className="text-left">
              <div className="font-semibold text-green-900">View Progress</div>
              <div className="text-sm text-green-600">Track your journey</div>
            </div>
          </Link>
        </Button>
      </div> */}
    </div>
  );
}
