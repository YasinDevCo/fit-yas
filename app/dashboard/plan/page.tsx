"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
interface IPlanDay {
  _id: string;
  dayOfWeek: number;
}

interface IPlane {
  _id: string;
  name: string;
  createdAt: string;
  type: string;
  days: IPlanDay[];
}

export default function PlansPage() {
  const [plans, setPlans] = useState<IPlane[]>([]);
  const daysOfWeek = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch("/api/plan/get");
      const data = await res.json();
      setPlans(data.plans || []);
    };

    fetchPlans();
  }, []);
  console.log(plans);

  const deletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    
    const res = await fetch(`/api/plan/delete/${planId}`, {
      method: "DELETE",
    });
    
    if (res.ok) {
      alert("Plan deleted successfully");
    // optionally: refresh list
  
  } else {
    const data = await res.json();
    alert(`Error: ${data.error}`);
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Workout Plans Management
          </h3>
          <p className="text-gray-600">
            Create, edit and manage your workout plans
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {plan.createdAt.toString()}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {plan.type}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Exercises:</span>
                  <span className="font-medium">{10} exercises</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Workout Days:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {plan.days.map((day) => (
                      <span
                        key={day._id}
                        className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                      >
                        {daysOfWeek[day.dayOfWeek]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plan Management Actions */}
              <div className="flex space-x-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <Link href={`/dashboard/plan/${plan._id}`}>
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <Link href={`/dashboard/plan/edit/${plan._id}`}>
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  onClick={() => deletePlan(plan._id)}
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No plans yet
          </h3>
          <p className="text-gray-600 mb-4">Create your first workout plan</p>
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
      )}
    </div>
  );
}
