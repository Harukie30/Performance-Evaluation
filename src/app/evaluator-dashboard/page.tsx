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
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  LogOut,
  User,
  FileText,
  XIcon,
  MenuIcon,
  Eye,
  Search,
  ArrowUpDown,
  Printer,
  Star,
  Target,
  X,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import RecentActivityModal from "@/components/RecentActivityModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";
import { reviewAPI, authAPI, employeeAPI } from "@/services/api";
import usersData from "@/data/users.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import NotificationBell from "@/components/NotificationBell";
import { reviewService } from "@/services/reviewService";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "employees", label: "Employees", icon: Users },
  { id: "evaluate", label: "Evaluate", icon: CheckCircle2 },
  { id: "evaluations", label: "Evaluations", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
  email: string;
  department: string;
  permissions: string[];
}

interface Evaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  ForRegular?:
    | "Q1 2023"
    | "Q2 2023"
    | "Q3 2023"
    | "Q4 2023"
    | "Q1 2024"
    | "Q2 2024";
  status: "draft" | "submitted" | "completed";
  lastModified: string;
}

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
}

interface Stat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface RecentActivity {
  id: string;
  type: "evaluation" | "update" | "completion";
  description: string;
  timestamp: string;
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

interface EvaluationResult {
  employeeId: string;
  employeeName: string;
  department: string;
  ForRegular: string;
  status: string;
  lastModified: string;
  scores: {
    category: string;
    score: number;
    weight: number;
  }[];
  totalScore: number;
  comments: string;
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

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

// Utility for consistent date/time formatting
function formatTimestamp(ts?: string) {
  if (!ts) return '';
  const date = new Date(ts);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Helper function to get relative time (same as HR dashboard)
const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export default function EvaluatorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [openQuarterModal, setOpenQuarterModal] = useState<null | {
    employeeId: string;
    quarter: "Q1" | "Q2" | "Q3" | "Q4";
  }>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<
    null | "Q1" | "Q2" | "Q3" | "Q4"
  >("Q1");
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<EvaluationResult | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  // Move loadData to top-level scope
  const loadData = async () => {
    try {
      // Load evaluations
      const evaluationsResponse = await fetch("/api/performance-review");
      if (evaluationsResponse.ok) {
        const evaluationsData = await evaluationsResponse.json();
        setEvaluations(evaluationsData);
      }

      // Load recent activities
      const activitiesResponse = await fetch("/api/recent-activities");
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        // Transform the data to match our enhanced RecentActivity interface
        const transformedActivities: RecentActivity[] = activitiesData.map(
          (activity: any) => ({
            id: activity.id,
            type: activity.type,
            description: activity.description,
            timestamp: activity.timestamp,
            employeeName: activity.employeeName,
            employeeId: activity.employeeId,
            reviewId: activity.reviewId,
            status: activity.status || "completed",
            department: activity.department || "General",
            position: activity.position || "Not specified",
            reviewPeriod: activity.reviewPeriod || "Current Period",
            score: activity.score || 0,
            comments: activity.comments || "",
          })
        );
        setRecentActivities(transformedActivities);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.me();
        const userData = response.data;

        if (!userData || userData.role.toLowerCase() !== "evaluator") {
          console.log("Unauthorized access, redirecting to login");
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

  // Load evaluations and recent activities
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Load notifications from localStorage or API
        const savedNotifications = localStorage.getItem(
          "evaluator-notifications"
        );
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        } else {
          // Add some sample notifications for demonstration
          const sampleNotifications: Notification[] = [
            {
              id: "1",
              type: "evaluation_completed",
              title: "Evaluation Completed",
              message:
                "Performance evaluation for John Doe has been completed successfully.",
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              read: false,
              employeeName: "John Doe",
            },
            {
              id: "2",
              type: "evaluation_started",
              title: "Evaluation Started",
              message:
                "Performance evaluation for Jane Smith has been started.",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 2
              ).toISOString(), // 2 hours ago
              read: true,
              employeeName: "Jane Smith",
            },
            {
              id: "3",
              type: "reminder",
              title: "Evaluation Reminder",
              message: "Reminder: Complete evaluation for David Brown",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 24
              ).toISOString(), // 1 day ago
              read: true,
              employeeName: "David Brown",
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
      localStorage.setItem(
        "evaluator-notifications",
        JSON.stringify(notifications)
      );
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
          ? "Evaluation Completed"
          : type === "evaluation_started"
          ? "Evaluation Started"
          : "Reminder",
      message:
        type === "evaluation_completed"
          ? `Performance evaluation for ${employeeName} has been completed successfully.`
          : type === "evaluation_started"
          ? `Performance evaluation for ${employeeName} has been started.`
          : `Reminder: Complete evaluation for ${employeeName}`,
      timestamp: new Date().toISOString(),
      read: false,
      employeeName,
      evaluationId,
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10 notifications
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

  // Test function to add a sample notification
  const addTestNotification = () => {
    const testEmployee =
      employees[Math.floor(Math.random() * employees.length)];
    if (testEmployee) {
      createNotification("evaluation_completed", testEmployee.name);
      toast.success("Test notification added!");
    }
  };

  const verifyEmployeeData = (employees: Employee[]) => {
    console.group("Employee Data Verification");
    console.log("Total employees:", employees.length);

    // Check for required fields
    const validEmployees = employees.every((emp) => {
      const isValid =
        emp.employeeId &&
        emp.name &&
        emp.email &&
        emp.department?.department_name &&
        emp.position?.title;
      if (!isValid) {
        console.warn("Invalid employee data:", emp);
      }
      return isValid;
    });

    // Count by department
    const departmentCount = employees.reduce((acc, emp) => {
      const dept = emp.department.department_name;
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("Department distribution:", departmentCount);
    console.log("All employees valid:", validEmployees);
    console.groupEnd();

    return validEmployees;
  };

  const loadEmployees = async () => {
    try {
      console.group("Loading Employees");
      console.log("Starting employee data load...");

      // Use the imported users data instead of API call
      const employees = usersData as Employee[];
      console.log("Raw employee data loaded:", employees);

      if (!employees || employees.length === 0) {
        console.warn("No employees found in the data");
        toast.warning("No employees found");
        return;
      }

      // Verify the data structure
      const isValid = verifyEmployeeData(employees);
      if (!isValid) {
        console.error("Employee data validation failed");
        toast.error("Employee data validation failed");
        return;
      }

      // Filter active employees
      const activeEmployees = employees.filter(
        (emp) => emp.status === "Active"
      );
      console.log("Active employees:", activeEmployees.length);

      setEmployees(employees);
      console.log("Successfully set employees in state");

      // Show success message with details
      toast.success(
        `Loaded ${employees.length} employees (${activeEmployees.length} active)`
      );
      console.groupEnd();
    } catch (error) {
      console.error("Failed to load employees:", error);
      toast.error("Failed to load employees. Please try again.");
      console.groupEnd();
    }
  };

  // Add useEffect to verify data loading
  useEffect(() => {
    if (user) {
      console.group("Initial Data Load");
      console.log("User authenticated:", user);
      console.log("Starting data load...");
      loadEmployees();
      console.groupEnd();
    }
  }, [user]);

  const loadEvaluations = async () => {
    try {
      const response = await reviewAPI.getAll();
      setEvaluations(response.data);
    } catch (error) {
      console.error("Failed to load evaluations:", error);
      toast.error("Failed to load evaluations");
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNewEvaluation = (employee?: Employee) => {
    if (employee) {
      // Create notification when evaluation is started
      createNotification("evaluation_started", employee.name);
      router.push(
        `/performance?employeeId=${encodeURIComponent(
          employee.employeeId
        )}&employeeName=${encodeURIComponent(
          employee.id.toString()
        )}&department=${encodeURIComponent(
          employee.department.department_name
        )}&position=${encodeURIComponent(employee.position.title)}`
      );
    } else {
      router.push("/performance");
    }
  };

  const handleViewEvaluation = (id: string) => {
    router.push(`/performance/${id}`);
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

  // Calculate statistics
  const stats: Stat[] = [
    {
      title: "Number of Employees",
      value: employees.length,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      description: "Total number of employees in the system",
    },
    {
      title: "Completed",
      value: evaluations.filter((e) => e.status === "completed").length,
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      description: "Successfully completed evaluations",
    },
    {
      title: "Pending",
      value:
        employees.length -
        evaluations.filter((e) => e.status === "completed").length,
      icon: <Clock className="h-6 w-6" />,
      color: "bg-yellow-100 text-yellow-600",
      description: "Employees awaiting evaluation",
    },
    {
      title: "Completion Rate",
      value:
        employees.length > 0
          ? `${(
              (evaluations.filter((e) => e.status === "completed").length /
                employees.length) *
              100
            ).toFixed(1)}%`
          : "0",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      description: "Overall completion percentage",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get unique departments for filter
  const departments = Array.from(
    new Set(employees.map((emp) => emp.department.department_name))
  );

  // Filter and sort employees
  const filteredAndSortedEmployees = employees
    .filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" ||
        employee.department.department_name === selectedDepartment;

      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewQuarters = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsQuarterModalOpen(true);
  };

  const handlePrintReview = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #1e40af; margin-bottom: 30px;">Performance Review - ${selectedQuarter}</h1>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Employee Information</h2>
          <p><strong>Name:</strong> ${selectedEmployee?.name}</p>
          <p><strong>Position:</strong> ${selectedEmployee?.position.title}</p>
          <p><strong>Department:</strong> ${
            selectedEmployee?.department.department_name
          }</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Overall Rating</h2>
          <p><strong>Rating:</strong> 4.5 / 5.0</p>
          <p>Performance exceeds expectations in most areas</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Performance Metrics</h2>
          <p><strong>Sales Target Achievement:</strong> 85%</p>
          <p><strong>Customer Satisfaction:</strong> 92%</p>
          <p><strong>Project Completion:</strong> 78%</p>
          <p><strong>Team Collaboration:</strong> 90%</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Key Achievements</h2>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 10px;">• Exceeded quarterly sales target by 15%</li>
            <li style="margin-bottom: 10px;">• Successfully implemented new customer service protocol</li>
            <li style="margin-bottom: 10px;">• Led team training session on new software implementation</li>
            <li style="margin-bottom: 10px;">• Streamlined workflow resulting in 20% efficiency increase</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Next Quarter Goals</h2>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin-bottom: 10px;">• Achieve 95% customer retention rate</li>
            <li style="margin-bottom: 10px;">• Implement new digital sales strategy</li>
            <li style="margin-bottom: 10px;">• Complete leadership development course</li>
            <li style="margin-bottom: 10px;">• Implement new workflow automation tools</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Evaluator Comments</h2>
          <p style="font-style: italic; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            "Demonstrated exceptional performance in achieving
            sales targets while maintaining high customer
            satisfaction. The implementation of new protocols
            has significantly improved team efficiency. Looking
            forward to continued growth in the next quarter."
          </p>
          <p style="text-align: right; margin-top: 10px;">
            <strong>John Smith</strong><br>
            Department Manager
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Performance Review - ${selectedEmployee?.name} - ${selectedQuarter}</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; }
                @page { margin: 0.5cm; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

  const handleViewResults = async (evaluation: Evaluation) => {
    if (!evaluation.id) {
      toast.error("Invalid evaluation ID");
      return;
    }
    try {
      console.log("Fetching evaluation details for:", evaluation.id);
      const response = await fetch(`/api/performance-review/${evaluation.id}`);
      console.log("API Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          errorData.error || "Failed to fetch evaluation details"
        );
      }
      const data = await response.json();
      console.log("Received evaluation data:", data);
      setSelectedEvaluation(data);
      setShowResultsModal(true);
    } catch (error) {
      console.error("Error fetching evaluation details:", error);
      toast.error("Failed to load evaluation details");
    }
  };

  const ResultsModal = ({
    evaluation,
    onClose,
  }: {
    evaluation: EvaluationResult | null;
    onClose: () => void;
  }) => {
    if (!evaluation) return null;

    return (
      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] border-0 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">
              Evaluation Results
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Employee Information */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-600">Employee</h3>
                <p className="text-lg">{evaluation.employeeName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Department</h3>
                <p className="text-lg">{evaluation.department}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">For Regular</h3>
                <p className="text-lg">{evaluation.ForRegular}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Status</h3>
                <p className="text-lg">{evaluation.status}</p>
              </div>
            </div>

            {/* Scores Table */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Performance Scores
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Weighted Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluation.scores.map((score, index) => (
                    <TableRow key={index}>
                      <TableCell>{score.category}</TableCell>
                      <TableCell>{score.score}</TableCell>
                      <TableCell>{score.weight}%</TableCell>
                      <TableCell>
                        {((score.score * score.weight) / 100).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={3}>Total Score</TableCell>
                    <TableCell>{evaluation.totalScore.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Comments</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{evaluation.comments}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={onClose} className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderContent = () => {
    if (!user) return null;

    if (activeTab === "dashboard") {
      return (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-blue-200 transition-shadow">
              <Users className="h-10 w-10 text-blue-500 mb-3" />
              <div className="text-3xl font-extrabold text-blue-700 mb-1">{employees.length}</div>
              <div className="text-gray-600 font-semibold">Total Employees</div>
            </Card>
            <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-green-200 transition-shadow">
              <FileText className="h-10 w-10 text-green-500 mb-3" />
              <div className="text-3xl font-extrabold text-green-700 mb-1">{evaluations.filter(e => e.status === 'completed').length}</div>
              <div className="text-gray-600 font-semibold">Completed Evaluations</div>
            </Card>
            <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-yellow-200 transition-shadow">
              <Clock className="h-10 w-10 text-yellow-500 mb-3" />
              <div className="text-3xl font-extrabold text-yellow-700 mb-1">{evaluations.filter(e => e.status === 'draft').length}</div>
              <div className="text-gray-600 font-semibold">Draft Evaluations</div>
            </Card>
            <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-purple-200 transition-shadow">
              <CheckCircle2 className="h-10 w-10 text-purple-500 mb-3" />
              <div className="text-3xl font-extrabold text-purple-700 mb-1">{evaluations.filter(e => e.status === 'submitted').length}</div>
              <div className="text-gray-600 font-semibold">Submitted Evaluations</div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mb-10 p-8 rounded-2xl shadow-xl border-0 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-700">Recent Activity</h2>
              <Button 
                onClick={() => loadData()}
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black font-semibold px-4 py-2 rounded-lg"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">Loading recent activities...</span>
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={activity.id} className="group relative">
                    {/* Activity Card */}
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-100 hover:border-blue-200">
                      {/* Icon and Status */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          {/* Status indicator */}
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Main Activity Text */}
                        <div className="mb-2">
                          <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                            {activity.description}
                          </p>
                        </div>

                        {/* Activity Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          {/* Timestamp */}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {/* Activity Type Badge */}
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {activity.type === 'evaluation' ? 'Evaluation' : activity.type === 'update' ? 'Update' : 'Completion'}
                            </span>
                          </div>

                          {/* Time Ago */}
                          <div className="text-gray-500">
                            {getTimeAgo(activity.timestamp)}
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-3 pt-3 border-t border-blue-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {activity.employeeName}
                            </span>
                            <span>•</span>
                            <span>Evaluator Dashboard</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => activity.reviewId && handleViewEvaluation(activity.reviewId)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Connection Line (except for last item) */}
                    {index < recentActivities.length - 1 && index < 4 && (
                      <div className="absolute left-6 top-16 w-0.5 h-4 bg-gradient-to-b from-blue-300 to-transparent"></div>
                    )}
                  </div>
                ))}

                {/* View All Button */}
                {recentActivities.length > 5 && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => setIsActivityModalOpen(true)}
                    >
                      View All {recentActivities.length} Activities
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Recent Activities</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  When you complete performance evaluations, they will appear here as recent activities for your evaluator dashboard.
                </p>
              </div>
            )}

            {/* Activity Summary */}
            {recentActivities.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {recentActivities.filter(a => a.type === 'completion').length} Completed
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {recentActivities.filter(a => a.type === 'evaluation').length} In Progress
                    </span>
                  </div>
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </Card>
        </>
      );
    }

    if (activeTab === "profile") {
      return (
        <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white max-w-xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-yellow-200 flex items-center justify-center text-4xl font-bold text-blue-700 shadow">
              {user.name.charAt(0)}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-1">{user.username}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Role: {user.role}</span>
            </div>
            <Button className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black font-semibold px-6 py-2 rounded-lg mt-4" onClick={() => setActiveTab("profile")}>Edit Profile</Button>
          </div>
        </Card>
      );
    }

    if (activeTab === "employees") {
      return (
        <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-700">Employees</h2>
            <Button className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black font-semibold px-6 py-2 rounded-lg">
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Employee ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Position</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {employees
                  .filter((employee) => employee.status === "Active")
                  .map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{employee.employeeId}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{employee.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{employee.department.department_name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{employee.position.title}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{employee.email}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{employee.location}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        <Button
                          className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                          size="sm"
                          onClick={() => handleViewQuarters(employee)}
                        >
                          View Quarters
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      );
    }

    if (activeTab === "evaluate") {
      return (
        <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Employees to Evaluate</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Employee ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Position</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {employees
                  .filter(emp => emp.status === "Active" && !evaluations.some(ev => ev.employeeId === emp.employeeId && ev.status === "completed"))
                  .map(emp => (
                    <tr key={emp.employeeId}>
                      <td className="px-4 py-2">{emp.employeeId}</td>
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.department.department_name}</td>
                      <td className="px-4 py-2">{emp.position.title}</td>
                      <td className="px-4 py-2">{emp.email}</td>
                      <td className="px-4 py-2">{emp.phone}</td>
                      <td className="px-4 py-2">
                        <Button
                          className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black"
                          size="sm"
                          onClick={() => handleNewEvaluation(emp)}
                        >
                          Evaluate
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      );
    }

    if (activeTab === "evaluations") {
      return (
        <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-700">Evaluations</h2>
            <Button className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black font-semibold px-6 py-2 rounded-lg">
              New Evaluation
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Employee ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Employee Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Period</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Last Modified</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{evaluation.employeeId}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{evaluation.employeeName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{evaluation.department}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{evaluation.ForRegular || 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        evaluation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        evaluation.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formatTimestamp(evaluation.lastModified)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                          size="sm"
                          onClick={() => handleViewEvaluation(evaluation.id)}
                        >
                          View
                        </Button>
                        {evaluation.status === 'completed' && (
                          <Button
                            className="bg-green-500 text-white hover:bg-green-600"
                            size="sm"
                            onClick={() => handleViewResults(evaluation)}
                          >
                            Results
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      );
    }

    return null;
  };

  if (!user || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen bg-blue-200">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white shadow-lg rounded-2xl flex flex-col py-6 px-2 lg:px-6">
        <div className="mb-8 flex justify-center">
          <img src="/images/smct.png" alt="SMCT Logo" className="h-12 w-auto" />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-center lg:justify-start group transition-all duration-200 py-3 lg:py-2 ${activeTab === item.id ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "hover:bg-gray-50"}`}
              onClick={() => handleTabChange(item.id)}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${activeTab === item.id ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}`} />
              <span className="ml-0 lg:ml-2 hidden lg:inline-block">{item.label}</span>
            </Button>
          ))}
        </nav>
        {/* Sidebar Separator */}
        <div className="my-6 border-t border-gray-200" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="rounded-2xl bg-blue-600 shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">Welcome to the Evaluator Dashboard</h1>
              <p className="text-lg text-blue-100 font-medium">Conduct performance evaluations, track employee progress, and manage review processes.</p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={notifications}
                onMarkAsRead={markNotificationAsRead}
                onMarkAllAsRead={markAllNotificationsAsRead}
              />
              <Button
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-50 transition-all"
                onClick={() => router.push('/performance')}
              >
                New Evaluation
              </Button>
            </div>
            {/* Profile User Card */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer rounded-xl p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-yellow-200 flex items-center justify-center text-xl font-bold text-blue-700 shadow">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-white">
                    <div className="font-semibold text-base leading-tight">{user.name}</div>
                    <div className="text-sm opacity-90">{user.role}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white opacity-70" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-0">
                <DropdownMenuItem onClick={() => handleTabChange("profile")} className="cursor-pointer hover:bg-blue-200">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tab Content */}
        {renderContent()}

        {/* Recent Activity Modal */}
        <RecentActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          activities={recentActivities}
        />

        {/* Results Modal */}
        <ResultsModal
          evaluation={selectedEvaluation}
          onClose={() => {
            setShowResultsModal(false);
            setSelectedEvaluation(null);
          }}
        />

        {/* Quarters Modal */}
        <Dialog
          open={isQuarterModalOpen}
          onOpenChange={setIsQuarterModalOpen}
        >
          <DialogContent className="w-full max-w-4xl max-h-[97vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50">
            <DialogHeader className="space-y-4 pb-6 border-b border-gray-100">
              <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Performance Review Summary
              </DialogTitle>
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsQuarterModalOpen(false)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
                <Button
                  variant="ghost"
                  onClick={handlePrintReview}
                  className="hover:bg-gray-100"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-8 py-6">
              {/* Quarter Selection */}
              <div className="flex gap-3 justify-center">
                {quarters.map((quarter) => (
                  <Button
                    key={quarter}
                    variant={
                      selectedQuarter === quarter ? "default" : "outline"
                    }
                    className={`w-24 h-12 text-lg font-semibold transition-all duration-200 ${
                      selectedQuarter === quarter
                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg hover:shadow-xl"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedQuarter(quarter)}
                  >
                    {quarter}
                  </Button>
                ))}
              </div>

              {/* Quarter Content */}
              {selectedQuarter && (
                <div className="space-y-8">
                  {/* Employee Info */}
                  <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${selectedEmployee?.name}`}
                        />
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
                          {selectedEmployee?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {selectedEmployee?.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {selectedEmployee?.position.title} • {selectedEmployee?.department.department_name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Employee ID: {selectedEmployee?.employeeId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evaluation Status */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">Q1</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">Q2</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-400">Q3</div>
                        <div className="text-sm text-gray-500">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
