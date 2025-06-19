"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  UserMinus,
  FileText,
  LogOut,
  Settings,
  MenuIcon,
  XIcon,
  BarChart3,
  CheckCircle2,
  Clock,
  User,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  Calendar,
  Plus,
  Loader2,
  Trash2,
  Eye,
  FileCheck,
  Search,
  Briefcase,
  Target,
  Star,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";
import { QuarterlyReviewModal } from "@/components/QuarterlyReviewModal";
import { employeeAPI, reviewAPI, authAPI } from "@/services/api";
import RecentActivityModal from "@/components/RecentActivityModal";
import NotificationBell from "@/components/NotificationBell";

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  position: {
    title: string;
  };
  department: {
    department_name: string;
  };
  location: string;
  status: string;
  datehired: {
    date: string;
  };
  quarterlyReviews?: {
    Q1?: { status: string; date?: string };
    Q2?: { status: string; date?: string };
    Q3?: { status: string; date?: string };
    Q4?: { status: string; date?: string };
  };
}

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
  department: string;
  permissions: string[];
}

interface Evaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewPeriod: string;
  status: "draft" | "submitted" | "completed";
  lastModified: string;
}

interface Activity {
  id: string;
  type: "evaluation" | "update" | "completion";
  description: string;
  timestamp: string;
  user: string;
  employeeName: string;
  employeeId: string;
  reviewId?: string;
  status?: string;
  department?: string;
  position?: string;
  reviewPeriod?: string;
  score?: number;
  comments?: string;
}

interface Notification {
  id: string;
  type: "evaluation_completed" | "evaluation_started" | "reminder";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  employeeName?: string;
  evaluationId?: string;
}

const QuarterViewModal = ({ employee }: { employee: Employee }) => {
  const [selectedQuarter, setSelectedQuarter] = useState<
    "Q1" | "Q2" | "Q3" | "Q4" | null
  >(null);
  const currentYear = new Date().getFullYear();
  const quarters = [
    { id: "Q1", label: "First Quarter", months: "Jan - Mar" },
    { id: "Q2", label: "Second Quarter", months: "Apr - Jun" },
    { id: "Q3", label: "Third Quarter", months: "Jul - Sep" },
    { id: "Q4", label: "Fourth Quarter", months: "Oct - Dec" },
  ];

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
            size="lg"
          >
            View Quarter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quarterly Reviews - {employee.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {quarters.map((quarter) => {
              const review =
                employee.quarterlyReviews?.[
                  quarter.id as keyof typeof employee.quarterlyReviews
                ];
              return (
                <div
                  key={quarter.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {quarter.label}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {quarter.months} {currentYear}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedQuarter(
                          quarter.id as "Q1" | "Q2" | "Q3" | "Q4"
                        )
                      }
                      disabled={
                        !review?.status || review.status === "not_started"
                      }
                      className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      View Details
                    </Button>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        review?.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : review?.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {review?.status || "Not Started"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {selectedQuarter && (
        <QuarterlyReviewModal
          isOpen={!!selectedQuarter}
          onClose={() => setSelectedQuarter(null)}
          quarter={selectedQuarter}
        />
      )}
    </>
  );
};

export default function HRDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<
    "Q1" | "Q2" | "Q3" | "Q4" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    location: "",
    address: "",
    status: "Active",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "employees", label: "Employees", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.me();

        if (!response || !response.data) {
          console.log("No response data received");
          router.push("/login");
          return;
        }

        const userData = response.data;
        console.log("Auth response:", userData);

        if (!userData.role) {
          console.log("No role found in user data");
          router.push("/login");
          return;
        }

        const userRole = userData.role.toLowerCase();
        if (userRole !== "hr") {
          console.log("Unauthorized role:", userRole);
          router.push("/login");
          return;
        }

        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadEmployees(),
          loadEvaluations(),
          loadActivities(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshActivities();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await employeeAPI.getAll();
      if (response.data) {
        setEmployees(response.data);
      } else {
        console.error("No data received from employee API");
        toast.error("Failed to load employees");
      }
    } catch (error) {
      console.error("Failed to load employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvaluations = async () => {
    try {
      const response = await reviewAPI.getAll();
      // Filter evaluations to only show completed ones for HR
      const completedEvaluations = response.data.filter(
        (evaluation: Evaluation) => evaluation.status === "completed"
      );
      setEvaluations(completedEvaluations);
    } catch (error) {
      console.error("Failed to load evaluations:", error);
      toast.error("Failed to load evaluations");
    }
  };

  const loadActivities = async () => {
    try {
      // Use the real API to fetch recent activities
      const response = await fetch("/api/recent-activities");
      if (response.ok) {
        const activitiesData = await response.json();
        // Transform the data to match our Activity interface
        const transformedActivities: Activity[] = activitiesData.map(
          (activity: any) => ({
            id: activity.id,
            type: activity.type,
            description: activity.description,
            timestamp: activity.timestamp,
            user: "Evaluator", // Since these come from evaluators
            employeeName: activity.employeeName,
            employeeId: activity.employeeId,
            reviewId: activity.reviewId,
            status: "completed", // All activities in HR dashboard are completed evaluations
            department: "General", // Will be populated from evaluation data if needed
            position: "Not specified",
            reviewPeriod: "Current Period",
            score: 0,
            comments: "",
          })
        );
        setActivities(transformedActivities);
      } else {
        console.error("Failed to fetch recent activities");
        // Fallback to sample data if API fails
        const sampleActivities: Activity[] = [
          {
            id: "1",
            type: "evaluation" as const,
            description: "Completed quarterly review for John Doe",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            user: "HR Manager",
            employeeName: "John Doe",
            employeeId: "EMP001",
            status: "completed",
            department: "Engineering",
            position: "Senior Developer",
            reviewPeriod: "Q1 2024",
            score: 85,
            comments: "Excellent performance in Q1",
          },
          {
            id: "2",
            type: "update" as const,
            description: "Updated performance metrics for Jane Smith",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            user: "HR Manager",
            employeeName: "Jane Smith",
            employeeId: "EMP002",
            status: "in_progress",
            department: "Marketing",
            position: "Marketing Manager",
            reviewPeriod: "Q1 2024",
            score: 92,
            comments: "Great progress on marketing campaigns",
          },
          {
            id: "3",
            type: "completion" as const,
            description: "Finalized annual review for Mike Johnson",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            user: "HR Manager",
            employeeName: "Mike Johnson",
            employeeId: "EMP003",
            status: "completed",
            department: "Sales",
            position: "Sales Director",
            reviewPeriod: "Annual 2023",
            score: 88,
            comments: "Outstanding sales performance",
          },
        ];
        setActivities(sampleActivities);
      }
    } catch (error) {
      console.error("Failed to load activities:", error);
      toast.error("Failed to load activities");
    }
  };

  // Function to refresh activities (can be called when new evaluations are completed)
  const refreshActivities = async () => {
    try {
      const previousActivityCount = activities.length;
      await loadActivities();

      // Check if there are new activities and create notifications
      if (activities.length > previousActivityCount) {
        const newActivities = activities.slice(
          0,
          activities.length - previousActivityCount
        );
        newActivities.forEach((activity) => {
          if (activity.type === "evaluation" && activity.employeeName) {
            createNotification(
              "evaluation_completed",
              activity.employeeName,
              activity.reviewId
            );
          }
        });
      }
    } catch (error) {
      console.error("Failed to refresh activities:", error);
    }
  };

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Load notifications from localStorage or API
        const savedNotifications = localStorage.getItem("hr-notifications");
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        } else {
          // Add some sample notifications for demonstration
          const sampleNotifications: Notification[] = [
            {
              id: "1",
              type: "evaluation_completed",
              title: "New Evaluation Received",
              message:
                "Performance evaluation for John Doe has been completed and submitted for review.",
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              read: false,
              employeeName: "John Doe",
            },
            {
              id: "2",
              type: "evaluation_completed",
              title: "New Evaluation Received",
              message:
                "Performance evaluation for Jane Smith has been completed and submitted for review.",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 2
              ).toISOString(), // 2 hours ago
              read: true,
              employeeName: "Jane Smith",
            },
          ];
          setNotifications(sampleNotifications);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("hr-notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // Create notification when evaluation is completed
  const createNotification = (
    type: Notification["type"],
    employeeName: string,
    evaluationId?: string
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title:
        type === "evaluation_completed"
          ? "New Evaluation Received"
          : type === "evaluation_started"
          ? "Evaluation Started"
          : "Reminder",
      message:
        type === "evaluation_completed"
          ? `Performance evaluation for ${employeeName} has been completed and submitted for review.`
          : type === "evaluation_started"
          ? `Performance evaluation for ${employeeName} has been started.`
          : `Reminder: Review evaluation for ${employeeName}`,
      timestamp: new Date().toISOString(),
      read: false,
      employeeName,
      evaluationId,
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10 notifications
    toast.success(`New evaluation received for ${employeeName}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newEmployee.name.trim()) {
      errors.name = "Name is required";
    }

    if (!newEmployee.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
      errors.email = "Email is invalid";
    }

    if (!newEmployee.phone.trim()) {
      errors.phone = "Phone is required";
    }

    if (!newEmployee.position.trim()) {
      errors.position = "Position is required";
    }

    if (!newEmployee.department.trim()) {
      errors.department = "Department is required";
    }

    if (!newEmployee.location.trim()) {
      errors.location = "Location is required";
    }

    if (!newEmployee.address.trim()) {
      errors.address = "Address is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEmployee = async () => {
    try {
      setIsAdding(true);
      const response = await employeeAPI.create(newEmployee);
      if (response.data) {
        toast.success("Employee added successfully");
        setIsAddEmployeeOpen(false);
        setNewEmployee({
          name: "",
          email: "",
          phone: "",
          position: "",
          department: "",
          location: "",
          address: "",
          status: "Active",
        });
        await loadEmployees();
      }
    } catch (error) {
      console.error("Failed to add employee:", error);
      toast.error("Failed to add employee");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      setIsDeleting(employeeId);
      await employeeAPI.delete(employeeId);
      toast.success("Employee deleted successfully");
      await loadEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
      toast.error("Failed to delete employee");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "employees" && employees.length === 0) {
      loadEmployees();
    }
  };

  const handleNewEvaluation = () => {
    router.push("/performance");
  };

  const handleViewEvaluation = (id: string) => {
    router.push(`/performance/view?id=${id}`);
  };

  const handleProfileUpdate = async (updatedUser: User) => {
    try {
      setUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.department_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      description: "Total number of employees in the system",
    },
    {
      title: "Active Employees",
      value: employees.filter((emp) => emp.status === "Active").length,
      icon: <UserCheck className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      description: "Currently active employees",
    },
    {
      title: "Completed Evaluations",
      value: evaluations.filter((e) => e.status === "completed").length,
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: "bg-emerald-100 text-emerald-600",
      description: "Successfully completed evaluations",
    },
    {
      title: "Completion Rate",
      value:
        employees.length > 0
          ? `${Math.round(
              (evaluations.filter((e) => e.status === "completed").length /
                employees.length) *
                100
            )}%`
          : "0%",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      description: "Percentage of employees with completed evaluations",
    },
  ];

  const renderContent = () => {
    if (activeTab === "dashboard") {
      return (
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-xl transform transition-all duration-500 hover:scale-[1.01] ease-in-out">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm48 0v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2V8h4V6h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <img
                src="/images/dataa.png"
                alt="SMCT Logo"
                className="h-15 lg:h-15 w-auto transition-opacity duration-300"
              />

              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-blue-100 opacity-90">
                  Here's what's happening with your HR dashboard today.
                </p>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-md border shadow-sm bg-white dark:bg-gray-900">
                <NotificationBell
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                  onMarkAllAsRead={markAllNotificationsAsRead}
                />
                <Button
                  onClick={() => handleNewEvaluation()}
                  className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  New Evaluation
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-none bg-white rounded-xl transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    Total Employees
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {employees.length}
                  </h3>
                  <p className="text-xs text-gray-500 opacity-90">
                    Total number of employees in the system
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-none bg-white rounded-xl transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    Active Employees
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {employees.filter((emp) => emp.status === "Active").length}
                  </h3>
                  <p className="text-xs text-gray-500 opacity-90">
                    Currently active employees
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600 transition-transform duration-300 group-hover:scale-110">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-none bg-white rounded-xl transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    Completed Evaluations
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {evaluations.filter((e) => e.status === "completed").length}
                  </h3>
                  <p className="text-xs text-gray-500 opacity-90">
                    Successfully completed evaluations
                  </p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-none bg-white rounded-xl transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    Completion Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {employees.length > 0
                      ? `${Math.round(
                          (evaluations.filter((e) => e.status === "completed")
                            .length /
                            employees.length) *
                            100
                        )}%`
                      : "0%"}
                  </h3>
                  <p className="text-xs text-gray-500 opacity-90">
                    Percentage of employees with completed evaluations
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 transition-transform duration-300 group-hover:scale-110">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="overflow-hidden bg-white border-0 shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h2 className="text-2xl font-semibold">Recent Activity</h2>
                  <span className="text-sm text-gray-500 ml-2">
                    ({activities.length} activities)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-green-500 text-white hover:text-white hover:bg-green-600 transition-all duration-200"
                    onClick={refreshActivities}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-blue-500 text-white hover:text-white hover:bg-red-500 group transition-all duration-200"
                    onClick={() => setIsActivityModalOpen(true)}
                  >
                    View All
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      No Recent Activities
                    </p>
                    <p className="text-sm">
                      Completed evaluations from evaluators will appear here
                    </p>
                  </div>
                ) : (
                  activities.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      className="group flex items-start gap-4 p-4 rounded-lg border border-gray-300 hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                      onClick={() =>
                        activity.reviewId &&
                        handleViewEvaluation(activity.reviewId)
                      }
                    >
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === "evaluation"
                            ? "bg-blue-100 text-blue-600"
                            : activity.type === "update"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {activity.type === "evaluation" ? (
                          <FileText className="h-4 w-4" />
                        ) : activity.type === "update" ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500 whitespace-nowrap">
                            {new Date(activity.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Employee:</span>{" "}
                            {activity.employeeName}
                          </p>
                          {activity.department &&
                            activity.department !== "General" && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Dept:</span>{" "}
                                {activity.department}
                              </p>
                            )}
                          {activity.reviewPeriod &&
                            activity.reviewPeriod !== "Current Period" && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Period:</span>{" "}
                                {activity.reviewPeriod}
                              </p>
                            )}
                        </div>
                        {activity.reviewId && (
                          <p className="text-xs text-blue-500 mt-1">
                            Click to view evaluation details
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Recent Activity Modal */}
          <RecentActivityModal
            isOpen={isActivityModalOpen}
            onClose={() => setIsActivityModalOpen(false)}
            activities={activities}
          />
        </div>
      );
    }

    if (activeTab === "profile") {
      return (
        <div className="max-w-4xl mx-auto py-8">
          <Card className="p-8 bg-white shadow-xl rounded-lg border-none">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-500 mb-8">Edit your name, avatar etc.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <Label
                    htmlFor="yourName"
                    className="text-gray-700 font-medium"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="yourName"
                    type="text"
                    value={user?.name || ""}
                    onChange={(e) =>
                      setUser(user ? { ...user, name: e.target.value } : null)
                    }
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="password"
                      type="password"
                      value="********"
                      disabled
                      className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button
                      variant="link"
                      className="text-blue-500 hover:underline p-0 h-auto"
                    >
                      Change
                    </Button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="emailAddress"
                    className="text-gray-700 font-medium"
                  >
                    Email Address
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="emailAddress"
                      type="email"
                      value={user?.username || ""}
                      onChange={(e) =>
                        setUser(
                          user ? { ...user, username: e.target.value } : null
                        )
                      }
                      className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button
                      variant="link"
                      className="text-blue-500 hover:underline p-0 h-auto"
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 flex flex-col items-center justify-start pt-14">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
                <Button className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200">
                  Upload a picture
                </Button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <Button
                onClick={() => handleProfileUpdate(user!)}
                className="px-13 py-2 bg-blue-600 text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    if (activeTab === "evaluations") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black">
              Completed Evaluations
            </h1>
          </div>

          <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
            <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-blue-600">
                Completed Evaluations
              </h2>
              <CheckCircle2 className="h-15 w-15 text-blue-600" />
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">
                    Loading evaluations...
                  </span>
                </div>
              ) : evaluations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No completed evaluations found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Review Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>{evaluation.employeeName}</TableCell>
                        <TableCell>{evaluation.department}</TableCell>
                        <TableCell>{evaluation.reviewPeriod}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Completed
                          </span>
                        </TableCell>
                        <TableCell>{evaluation.lastModified}</TableCell>
                        <TableCell>
                          <Button
                            className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                            size="sm"
                            onClick={() => handleViewEvaluation(evaluation.id)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>

          {/* Add Employee Dialog */}
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new employee to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newEmployee.position}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        position: e.target.value,
                      })
                    }
                    className={formErrors.position ? "border-red-500" : ""}
                  />
                  {formErrors.position && (
                    <p className="text-sm text-red-500">
                      {formErrors.position}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newEmployee.department}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                    }
                    className={formErrors.department ? "border-red-500" : ""}
                  />
                  {formErrors.department && (
                    <p className="text-sm text-red-500">
                      {formErrors.department}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEmployee.location}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        location: e.target.value,
                      })
                    }
                    className={formErrors.location ? "border-red-500" : ""}
                  />
                  {formErrors.location && (
                    <p className="text-sm text-red-500">
                      {formErrors.location}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newEmployee.address}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        address: e.target.value,
                      })
                    }
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && (
                    <p className="text-sm text-red-500">{formErrors.address}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                    onClick={() => setIsAddEmployeeOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Employee"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    if (activeTab === "employees") {
      return (
        <Tabs defaultValue="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-3xl">Employees</h2>
            <Button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
              disabled={isLoading}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Employee
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search employees by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full max-w-md"
            />
          </div>

          <TabsList className="bg-gray-200 p-1 rounded-lg">
            <TabsTrigger
              value="active"
              className="flex-1 py-2 px-4 rounded-md text-gray-700 data-[state=active]:bg-yellow-300 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >
              Active Employees
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex-1 py-2 px-4 rounded-md text-gray-700 data-[state=active]:bg-yellow-300 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >
              Completed Evaluations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" key="active">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
              <div className="p-6 border-p bg-yellow-200 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-blue-600">
                  Active Employees
                </h2>
                <Users className="h-15 w-15 text-blue-600" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees
                    .filter((employee) => employee.status === "Active")
                    .filter((employee) => {
                      const searchTerm = searchQuery.toLowerCase();
                      return (
                        employee.name.toLowerCase().includes(searchTerm) ||
                        employee.email.toLowerCase().includes(searchTerm) ||
                        employee.department.department_name
                          .toLowerCase()
                          .includes(searchTerm)
                      );
                    })
                    .map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.employeeId}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>
                          {employee.department.department_name}
                        </TableCell>
                        <TableCell>{employee.position.title}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.location}</TableCell>
                        <TableCell>{employee.datehired.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedQuarter("Q1")}
                              className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                            >
                              View Quarters
                            </Button>
                            {selectedQuarter && (
                              <QuarterlyReviewModal
                                isOpen={true}
                                onClose={() => setSelectedQuarter(null)}
                                quarter={selectedQuarter}
                              />
                            )}
                            {user?.role === "HR" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="text-red-600 hover:text-white hover:bg-red-500"
                                    disabled={
                                      isDeleting === employee.employeeId ||
                                      isLoading
                                    }
                                  >
                                    {isDeleting === employee.employeeId ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <UserMinus className="h-6 w-6" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the employee and remove
                                      their data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteEmployee(
                                          employee.employeeId
                                        )
                                      }
                                      className="bg-red-500 text-white hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="completed" key="completed">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
              <div className="p-6 border-p bg-emerald-200 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-emerald-700">
                  Completed Evaluations
                </h2>
                <CheckCircle2 className="h-15 w-15 text-emerald-600" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Evaluation Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations
                    .filter((evaluation) => evaluation.status === "completed")
                    .filter((evaluation) => {
                      const searchTerm = searchQuery.toLowerCase();
                      return (
                        evaluation.employeeName
                          .toLowerCase()
                          .includes(searchTerm) ||
                        evaluation.department.toLowerCase().includes(searchTerm)
                      );
                    })
                    .map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>{evaluation.employeeId}</TableCell>
                        <TableCell>{evaluation.employeeName}</TableCell>
                        <TableCell>{evaluation.department}</TableCell>
                        <TableCell>{evaluation.reviewPeriod}</TableCell>
                        <TableCell>
                          {/* Find employee email from employees array */}
                          {employees.find(
                            (emp) => emp.employeeId === evaluation.employeeId
                          )?.email || "N/A"}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                            {evaluation.status}
                          </span>
                        </TableCell>
                        <TableCell>{evaluation.lastModified}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                router.push(`/performance/${evaluation.id}`)
                              }
                              className="flex items-center gap-2 bg-emerald-500 text-white hover:text-black hover:bg-yellow-400"
                            >
                              <Eye className="h-4 w-4" />
                              View Evaluation
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      );
    }

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-xl transform transition-all duration-500 hover:scale-[1.01] ease-in-out">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm48 0v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2V8h4V6h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <img
              src="/images/dataa.png"
              alt="SMCT Logo"
              className="h-15 lg:h-15 w-auto transition-opacity duration-300"
            />

            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-blue-100 opacity-90">
                Here's what's happening with your HR dashboard today.
              </p>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md border shadow-sm bg-white dark:bg-gray-900">
              <NotificationBell
                notifications={notifications}
                onMarkAsRead={markNotificationAsRead}
                onMarkAllAsRead={markAllNotificationsAsRead}
              />
              <Button
                onClick={() => handleNewEvaluation()}
                className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                New Evaluation
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl transition-all duration-300 border-none bg-white rounded-xl transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-gray-500 opacity-90">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-full ${stat.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Employee List */}
        <Card className="mt-8 bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
          <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-blue-600">
              Employee Management
            </h2>
            <Users className="h-15 w-15 text-blue-600" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees
                .filter((employee) => employee.status === "Active")
                .map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department.department_name}</TableCell>
                    <TableCell>{employee.position.title}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.location}</TableCell>
                    <TableCell>{employee.datehired.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuarter("Q1")}
                          className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          View Quarters
                        </Button>
                        {selectedQuarter && (
                          <QuarterlyReviewModal
                            isOpen={true}
                            onClose={() => setSelectedQuarter(null)}
                            quarter={selectedQuarter}
                          />
                        )}
                        {user?.role === "HR" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="text-red-600 hover:text-white hover:bg-red-500"
                                disabled={
                                  isDeleting === employee.employeeId ||
                                  isLoading
                                }
                              >
                                {isDeleting === employee.employeeId ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserMinus className="h-6 w-6" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the employee and remove
                                  their data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteEmployee(employee.employeeId)
                                  }
                                  className="bg-red-500 text-white hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>

        {/* Recent Activity Modal */}
        <RecentActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          activities={activities}
        />
      </div>
    );
  };

  if (!user || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-blue-200">
      {/* Sidebar */}
      <div className="fixed md:relative w-full md:w-20 lg:w-64 h-full transition-all duration-300 z-30">
        {/* Mobile Toggle Button */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 z-40 text-gray-700 hover:bg-yellow-400 rounded-full"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <XIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>

        {/* Sidebar Container */}
        <div
          className={`bg-white shadow-lg rounded-2xl flex flex-col h-full transition-all duration-300 transform ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
            {/* Logo */}
            <div className="mb-6 lg:mb-8 flex justify-center bg-gradient-blue-500">
              <img
                src="/images/smct.png"
                alt="SMCT Logo"
                className="h-15 lg:h-17 w-auto transition-opacity duration-300"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-1 bg-blue-200 rounded-2xl">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-center lg:justify-start group transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                  } py-3 lg:py-2`}
                  onClick={() => handleTabChange(item.id)}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                      activeTab === item.id
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-600"
                    }`}
                  />
                  <span className="ml-0 lg:ml-2 hidden lg:inline-block transition-all duration-200">
                    {item.label}
                  </span>
                </Button>
              ))}
            </nav>
          </div>

          {/* User Profile */}
          <div className="flex flex-col items-center lg:flex-row lg:items-start gap-4 mb-8 p-4 rounded-xl bg-white border border-gray-400 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <Avatar className="h-14 w-14 flex-shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${user?.username}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-600 font-medium">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border-2 border-white"></div>
            </div>

            <div className="text-center lg:text-left flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-lg md:text-xl truncate">
                {user?.name}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 justify-center lg:justify-start">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                  {user?.role}
                </span>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <p className="text-sm text-gray-500 mt-1 sm:mt-0 truncate">
                  {user?.department || "Human Resources"}
                </p>
              </div>
              <div className="p-3 lg:p-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="w-full justify-center lg:justify-start text-red-600 hover:text-white hover:bg-red-500 group transition-all duration-200"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="ml-0 lg:ml-2 hidden lg:inline-block">
                    Logout
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-blue-200">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
