"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  BarChart3,
  FileText,
  ChevronDown,
  LogOut,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { loadEvaluations, Evaluation } from "@/services/evaluationService";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "my-reviews", label: "My Reviews", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

export default function EmployeeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user] = useState({
    name: "Employee Name",
    role: "Employee",
    employeeId: "EMP001",
  });
  const [recentReviews, setRecentReviews] = useState<Evaluation[]>([]);

  useEffect(() => {
    // Fetch evaluations for the logged-in employee
    const allEvaluations = loadEvaluations();
    const myReviews = allEvaluations.filter(
      (review) => review.employeeId === user.employeeId
    );
    // Sort by reviewDate descending
    myReviews.sort(
      (a, b) =>
        new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
    );
    setRecentReviews(myReviews);
  }, [user.employeeId]);

  // Helper function to get relative time
  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - reviewDate.getTime()) / 1000
    );
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minute(s) ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hour(s) ago`;
    return `${Math.floor(diffInSeconds / 86400)} day(s) ago`;
  }

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-gray-600 shadow-lg rounded-2xl flex flex-col py-8 px-2 lg:px-6">
        <div className="mb-8 flex items-center justify-center space-x-2">
          <img src="/images/smct.png" alt="SMCT Logo" className="h-12 w-auto" />
          <p className="font-bold text-white">Performance Evaluation</p>
        </div>
        <div className="my-8 border-1 mt-0 border-gray-500" />
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-center lg:justify-start group transition-all duration-200 py-3 lg:py-2 ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon
                className={`h-5 w-5 flex-shrink-0 ${
                  activeTab === item.id
                    ? "text-blue-600"
                    : "text-white group-hover:text-blue-600"
                }`}
              />
              <span
                className={`ml-0 lg:ml-2 hidden lg:inline-block transition-colors duration-200
                  ${
                    activeTab === item.id
                      ? "text-blue-600 font-bold"
                      : "text-white group-hover:text-blue-400"
                  }
                `}
              >
                {item.label}
              </span>
            </Button>
          ))}
        </nav>
        {/* Sidebar Separator */}
        <div className="my-8 border-1 border-gray-500" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="rounded-2xl bg-blue-600 shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">
                Welcome, {user.name}
              </h1>
              <p className="text-lg text-blue-100 font-medium">
                This is your employee dashboard. Here you can view your
                performance reviews, track your progress, and receive important
                updates.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-50 transition-all"
                onClick={() => setActiveTab("my-reviews")}
              >
                View My Reviews
              </Button>
              {/* Profile User Card */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer rounded-xl p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-yellow-200 flex items-center justify-center text-xl font-bold text-blue-700 shadow">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-white">
                      <div className="font-semibold text-base leading-tight">
                        {user.name}
                      </div>
                      <div className="text-sm opacity-90">{user.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white opacity-70" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white border-0"
                >
                  <DropdownMenuItem
                    onClick={() => setActiveTab("profile")}
                    className="cursor-pointer hover:bg-blue-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/login")}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-blue-200 transition-shadow">
                <div className="text-3xl font-extrabold text-blue-700 mb-1">
                  N/A
                </div>
                <div className="text-gray-600 font-semibold">
                  My Performance
                </div>
              </Card>
              <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-green-200 transition-shadow">
                <div className="text-3xl font-extrabold text-green-700 mb-1">
                  N/A
                </div>
                <div className="text-gray-600 font-semibold">My Reviews</div>
              </Card>
              <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-yellow-200 transition-shadow">
                <div className="text-3xl font-extrabold text-yellow-700 mb-1">
                  N/A
                </div>
                <div className="text-gray-600 font-semibold">Notifications</div>
              </Card>
            </div>

            {/* Recent Activity Card */}
            <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white text-left mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-700">
                  Recent Activity
                </h2>
              </div>
              {recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {recentReviews.slice(0, 5).map((review, idx) => (
                    <div
                      key={review.reviewDate + idx}
                      className="group relative"
                    >
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-100 hover:border-blue-200">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                              {`Your review for ${review.reviewYear} was completed by ${review.reviewer}`}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {new Date(review.reviewDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                Evaluation Completed
                              </span>
                            </div>
                            <div className="text-gray-500">
                              {getTimeAgo(review.reviewDate)}
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-blue-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Performance Review
                              </span>
                              <span>•</span>
                              <span>Employee Dashboard</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            // onClick={() => handleViewEvaluation(review.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      {idx < recentReviews.length - 1 && idx < 4 && (
                        <div className="absolute left-6 top-16 w-0.5 h-4 bg-gradient-to-b from-blue-300 to-transparent"></div>
                      )}
                    </div>
                  ))}
                  {recentReviews.length > 5 && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        View All {recentReviews.length} Activities
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Recent Activities
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    When your performance reviews are completed, they will
                    appear here as recent activities for your dashboard.
                  </p>
                </div>
              )}
            </Card>
          </>
        )}
        {/* You can add more tab content for "my-reviews" and "profile" here in the future */}
      </main>
    </div>
  );
}
