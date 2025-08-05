"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  fetchProfile,
  ProfileData,
  setField,
  toggleEditing,
  updateProfile,
} from "@/slice/profileSlice";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LogOut,
  Trash2,
  Settings,
  User,
  Mail,
  Phone,
  Calendar,
  Weight,
  Ruler,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const formData = useSelector((state: RootState) => state.profile.formData);
  const isEditing = useSelector((state: RootState) => state.profile.isEditing);

  useEffect(() => {
    if (session?.user) {
      dispatch(fetchProfile());
    }
  }, [session, dispatch]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    dispatch(setField({ field, value }));
  };

  const handleToggleEditing = () => {
    dispatch(toggleEditing());
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();

      // نمایش Toast موفقیت
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      toast.textContent = "Profile updated successfully!";
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Failed to update profile.");
      }
    }
  };

  const stats = {
    totalWorkouts: 47,
    currentStreak: 5,
    totalTime: "23h 45m",
    avgPerWeek: 4.2,
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account permanently? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/profile/delete", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert("Account deleted successfully.");
        signOut({ callbackUrl: "/" });
      } else {
        alert(`Error: ${data.message || "Failed to delete account"}`);
      }
    } catch (error) {
      alert("Server error while deleting account");
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center lg:text-left">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Profile & Settings
        </h3>
        <p className="text-gray-600 text-lg">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h4 className="text-2xl font-bold text-gray-900">
                {formData.firstName} {formData.lastName}
              </h4>
              <p className="text-gray-600">{formData.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since January 2024
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-500">
                  {stats.totalWorkouts}
                </div>
                <p className="text-xs text-gray-600">Total Workouts</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {stats.currentStreak}
                </div>
                <p className="text-xs text-gray-600">Current Streak</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
            <Button
              onClick={() => (isEditing ? handleSave() : handleToggleEditing())}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
                className="border-2 border-gray-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
                className="border-2 border-gray-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className="border-2 border-gray-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <Phone className="mr-2 h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                className="border-2 border-gray-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="age"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                disabled={!isEditing}
                className="border-2 border-gray-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="weight"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <Weight className="mr-2 h-4 w-4" />
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                disabled={!isEditing}
                className="border-2 border-gray-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="height"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <Ruler className="mr-2 h-4 w-4" />
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                disabled={!isEditing}
                className="border-2 border-gray-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="fitnessGoal"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Fitness Goal
              </Label>
              <select
                id="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={(e) =>
                  handleInputChange("fitnessGoal", e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-orange-500 disabled:bg-gray-50"
              >
                <option value="Build Muscle">Build Muscle</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Improve Endurance">Improve Endurance</option>
                <option value="General Fitness">General Fitness</option>
                <option value="Strength Training">Strength Training</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fitness Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Fitness Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalWorkouts}
              </div>
              <p className="text-blue-700 text-sm">Total Workouts</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.currentStreak}
              </div>
              <p className="text-green-700 text-sm">Current Streak</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalTime}
              </div>
              <p className="text-purple-700 text-sm">Total Time</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.avgPerWeek}
              </div>
              <p className="text-orange-700 text-sm">Avg/Week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="space-y-4">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-red-600">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out of Account
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account Permanently
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
