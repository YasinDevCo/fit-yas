import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* App Logo and Name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg">
            <Dumbbell className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FitYas</h1>
          <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto"></div>
        </div>

        {/* Sports Image */}
        <div className="relative mb-8">
          <div className="relative z-10">
            <Image
              src="/mainpic.png"
              alt="Professional athlete working out with dumbbells"
              width={280}
              height={280}
              className="rounded-3xl shadow-xl object-cover"
              priority
            />
          </div>
          {/* Animated background circle */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl opacity-20 blur-xl animate-pulse"></div>
        </div>

        {/* Introduction Text */}
        <div className="text-center mb-10 max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
            Welcome to Your Fitness Journey
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Enter and follow your workout plan through the app. Take a step
            towards your goal every day.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link
              href="/auth"
              className="flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
          >
            <Link href="/auth" className="text-gray-700">
              Log In
            </Link>
          </Button>
        </div>

        {/* Quick Features */}
        <div className="flex items-center justify-center space-x-8 mt-12 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>Personal Plan</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Track Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>Daily Workouts</span>
          </div>
        </div>
      </div>

      {/* Bottom Decoration
      <div className="relative h-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-red-50 to-orange-100 opacity-50"></div>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-orange-300 to-red-300 rounded-full opacity-20 blur-2xl"></div>
      </div> */}
    </div>
  );
}
