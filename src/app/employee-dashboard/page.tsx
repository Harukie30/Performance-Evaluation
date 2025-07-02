"use client";
import { useState, useEffect } from "react";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "my-reviews", label: "My Reviews", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

const METRIC_LABELS = [
  { key: "jobKnowledge", label: "Job Knowledge" },
  { key: "qualityOfWork", label: "Quality of Work" },
  { key: "promptnessOfWork", label: "Promptness of Work" },
  { key: "qualityStandards", label: "Quality Standards" },
  { key: "timeliness", label: "Timeliness" },
  { key: "workOutput", label: "Work Output" },
  { key: "consistency", label: "Consistency" },
  { key: "jobTargets", label: "Job Targets" },
  { key: "adaptability", label: "Adaptability" },
];

export default function EmployeeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user] = useState({
    name: "Employee Name",
    role: "Employee",
    employeeId: "EMP001",
    position: "Software Engineer",
    department: "IT Department",
  });
  const [recentReviews, setRecentReviews] = useState<Evaluation[]>([]);
  const [reminders] = useState([
    { id: 1, text: "Next performance review due: June 30, 2024" },
    { id: 2, text: "Submit self-assessment by June 15, 2024" },
  ]);
  const [announcements] = useState([
    {
      id: 1,
      title: "New HR Policy Update",
      body: "Please review the updated remote work policy effective July 1.",
    },
    {
      id: 2,
      title: "Wellness Program",
      body: "Join our new wellness program for exclusive benefits!",
    },
  ]);

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

  const metricAverages = METRIC_LABELS.map(({ key, label }) => {
    const values = recentReviews.map((r) => Number((r as any)[key]) || 0);
    const avg = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
    return { metric: label, value: avg };
  });

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-gray-600 shadow-lg rounded-2xl flex flex-col py-8 px-2 lg:px-6 justify-between">
        <div>
          <div className="mb-8 flex items-center justify-center space-x-2">
            <img
              src="/images/smct.png"
              alt="SMCT Logo"
              className="h-12 w-auto"
            />
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
          {/* Logout Button at the bottom */}
        <Button
          className="w-full justify-center mt-8 bg-red-600 text-white hover:bg-red-700 font-semibold py-3 rounded-lg"
          onClick={() => router.push("/login")}
        >
          <LogOut className="h-2 w-5 mr-2" />
          <span className="hidden lg:inline">Logout</span>
        </Button>
          <div className="my-8 border-1 border-gray-500" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 space-y-8">
        {/* Profile Info Card */}
        <Card className="mb-4 p-6 rounded-2xl shadow-xl border-0 bg-white flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 to-yellow-200 flex items-center justify-center text-4xl font-bold text-blue-700 shadow">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-700 mb-1">
              {user.name}
            </h2>
            <div className="text-gray-600 mb-1">
              ID: <span className="font-semibold">{user.employeeId}</span>
            </div>
            <div className="text-gray-600 mb-1">
              Position: <span className="font-semibold">{user.position}</span>
            </div>
            <div className="text-gray-600">
              Department:{" "}
              <span className="font-semibold">{user.department}</span>
            </div>
          </div>
        </Card>

        {/* Reminders & Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 rounded-2xl shadow-xl border-0 bg-white">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Reminders</h3>
            <ul className="list-disc pl-6 text-gray-700">
              {reminders.map((r) => (
                <li key={r.id}>{r.text}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-6 rounded-2xl shadow-xl border-0 bg-white">
            <h3 className="text-lg font-bold text-blue-700 mb-2">
              Announcements
            </h3>
            <ul className="space-y-2">
              {announcements.map((a) => (
                <li key={a.id}>
                  <div className="font-semibold text-blue-800">{a.title}</div>
                  <div className="text-gray-700 text-sm">{a.body}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {activeTab === "dashboard" && (
          <>
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
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                              {`Review for ${review.reviewYear} completed by ${review.reviewer}`}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
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
                          </div>
                        </div>
                      </div>
                      {idx < recentReviews.length - 1 && idx < 4 && (
                        <div className="absolute left-6 top-16 w-0.5 h-4 bg-gradient-to-b from-blue-300 to-transparent"></div>
                      )}
                    </div>
                  ))}
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

        {activeTab === "my-reviews" && (
          <>
            <Card className="mb-8 p-8 rounded-2xl shadow-xl border-0 bg-white">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">
                My Review Metrics
              </h2>
              {recentReviews.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={metricAverages}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="metric"
                      tick={{ fontSize: 13 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 5]} tickCount={6} />
                    <Tooltip formatter={(value: any) => value.toFixed(2)} />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Average Score"
                      fill="#4F8EF7"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-400 py-16 text-lg">
                  No review metrics to display yet.
                </div>
              )}
            </Card>
            <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white text-left mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-700">
                  Evaluation Results
                </h2>
              </div>
              {recentReviews.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          Year
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          Reviewer
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          Date Completed
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {recentReviews.map((review, idx) => (
                        <tr key={review.reviewDate + idx}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                            {review.reviewYear}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                            {review.reviewer}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                            {new Date(review.reviewDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700 font-semibold">
                            Completed
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Evaluation Results
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    When your performance reviews are completed, they will
                    appear here.
                  </p>
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
