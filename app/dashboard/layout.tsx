"use client";
import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  User,
  LogOut,
  Menu,
  X,
  Calendar,
  Play,
  Target,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Calendar,
      href: "/dashboard",
      description: "Overview & Stats",
    },
    {
      id: "workout",
      label: "Workout",
      icon: Play,
      href: "/dashboard/workout",
      description: "Execute Workouts",
    },
    {
      id: "plans",
      label: "Plans",
      icon: Target,
      href: "/dashboard/plan",
      description: "Manage Plans",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/dashboard/profile",
      description: "Account Settings",
    },
  ];

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/profile") return "Profile";
    if (pathname === "/dashboard/workout") return "Workout";
    if (pathname === "/dashboard/workout/today") return "Today's Workout";
    if (pathname === "/dashboard/plan") return "Plans";
    if (pathname === "/dashboard/plan/new") return "Create New Plan";
    if (
      pathname.startsWith("/dashboard/plan/") &&
      pathname !== "/dashboard/plan/new"
    )
      return "Plan Details";
    return "Dashboard";
  };
  // const { data: session, status } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b  bg-gradient-to-r from-orange-500 to-red-500">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Dumbbell className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FitApp</h1>
              <p className="text-xs text-orange-100">Fitness Tracker</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.id === "plans" &&
                  pathname.startsWith("/dashboard/plan")) ||
                (item.id === "workout" &&
                  pathname.startsWith("/dashboard/workout"));

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-orange-500"
                      }`}
                    />
                    <div className="flex-1">
                      <span className="font-semibold">{item.label}</span>
                      <p
                        className={`text-xs ${
                          isActive ? "text-orange-100" : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden mr-4"
              >
                <Menu className="h-6 w-6 text-gray-500" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {getPageTitle()}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:flex bg-transparent"
              >
                <Link href="/dashboard/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
