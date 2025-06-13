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
  type: string;
  description: string;
  timestamp: string;
  user: string;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    location: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    location: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const router = useRouter();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "evaluations", label: "Evaluations", icon: FileText },
    { id: "employees", label: "Employee Management", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.me();
        
        if (!response || !response.data) {
          console.log("No response data received");
          router.push('/login');
          return;
        }

        const userData = response.data;
        console.log("Auth response:", userData);

        if (!userData.role) {
          console.log("No role found in user data");
          router.push('/login');
          return;
        }

        const userRole = userData.role.toLowerCase();
        if (userRole !== 'hr') {
          console.log("Unauthorized role:", userRole);
          router.push('/login');
          return;
        }

        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (user) {
      loadEmployees();
      loadEvaluations();
      loadActivities();
    }
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
      setEvaluations(response.data);
    } catch (error) {
      console.error("Failed to load evaluations:", error);
      toast.error("Failed to load evaluations");
    }
  };

  const loadActivities = async () => {
    try {
      const response = await reviewAPI.getRecent();
      setActivities(response.data);
    } catch (error) {
      console.error("Failed to load activities:", error);
      toast.error("Failed to load activities");
    }
  };

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      location: "",
    };
    let isValid = true;

    if (!newEmployee.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!newEmployee.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!newEmployee.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    }

    if (!newEmployee.position.trim()) {
      errors.position = "Position is required";
      isValid = false;
    }

    if (!newEmployee.department.trim()) {
      errors.department = "Department is required";
      isValid = false;
    }

    if (!newEmployee.location.trim()) {
      errors.location = "Location is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
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

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user || isLoading) {
    return <LoadingScreen />;
  }

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status !== "Active"
  ).length;
  const activeRate =
    totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      description: "Total number of employees",
    },
    {
      title: "Active",
      value: activeEmployees,
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      description: "Currently active employees",
    },
    {
      title: "Inactive",
      value: inactiveEmployees,
      icon: <Clock className="h-6 w-6" />,
      color: "bg-yellow-100 text-yellow-600",
      description: "Inactive employees",
    },
    {
      title: "Active Rate",
      value: `${activeRate.toFixed(1)}%`,
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      description: "Percentage of active employees",
    },
  ];

  const renderContent = () => {
    if (activeTab === "dashboard") {
      return (
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <img
                  src="/images/dataa.png"
                  alt="SMCT Logo"
                  className="h-15 lg:h-15 w-auto transition-opacity duration-300"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-blue-100">
                  Here's what's happening with your HR dashboard today.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Employees
                  </p>
                  <h3 className="text-3xl font-bold text-blue-600">
                    {employees.length}
                  </h3>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Active Employees
                  </p>
                  <h3 className="text-3xl font-bold text-blue-600">
                    {employees.filter((emp) => emp.status === "Active").length}
                  </h3>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Inactive Employees
                  </p>
                  <h3 className="text-3xl font-bold text-blue-600">
                    {
                      employees.filter((emp) => emp.status === "Inactive")
                        .length
                    }
                  </h3>
                </div>
                <UserX className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Active Rate
                  </p>
                  <h3 className="text-3xl font-bold text-blue-600">
                    {employees.length > 0
                      ? `${Math.round(
                          (employees.filter((emp) => emp.status === "Active")
                            .length /
                            employees.length) *
                            100
                        )}%`
                      : "0%"}
                  </h3>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
            <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-blue-600">
                Recent Activity
              </h2>
              <Activity className="h-15 w-15 text-blue-600" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.user} • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
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
                    value={user?.name}
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
                      value={user?.username}
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
                onClick={() => user && handleProfileUpdate(user)}
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
        <Tabs defaultValue="pending" className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-black ">
              Employee Evaluations
            </h2>
          </div>
          <TabsList className="space-x-4 bg-gray-200 p-1 rounded-lg">
            <TabsTrigger
              value="pending"
              className="flex-1 py-2 px-4 rounded-md text-gray-700 data-[state=active]:bg-yellow-400 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >
              Pending Evaluations
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex-1 py-2 px-4 rounded-md text-gray-700 data-[state=active]:bg-yellow-400 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >
              Completed Evaluations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" key="pending">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-blue-600">
                  Pending Evaluations
                </h2>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleNewEvaluation}
                    className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    New Evaluation
                  </Button>
                  <FileText className="h-15 w-15 text-blue-600" />
                </div>
              </div>
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
                  {evaluations
                    .filter((evaluation) => evaluation.status !== "completed")
                    .map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>{evaluation.employeeName}</TableCell>
                        <TableCell>{evaluation.department}</TableCell>
                        <TableCell>{evaluation.reviewPeriod}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              evaluation.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            Pending
                          </span>
                        </TableCell>
                        <TableCell>{evaluation.lastModified}</TableCell>
                        <TableCell>
                          <Button
                            className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                            size="sm"
                            onClick={() => handleNewEvaluation()}
                          >
                            New Evaluation
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="completed" key="completed">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-p bg-yellow-200 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-green-700">
                  Completed Evaluations
                </h2>
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-15 w-15 text-green-600" />
                </div>
              </div>
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
                  {evaluations
                    .filter((evaluation) => evaluation.status === "completed")
                    .map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell>{evaluation.employeeName}</TableCell>
                        <TableCell>{evaluation.department}</TableCell>
                        <TableCell>{evaluation.reviewPeriod}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            completed
                          </span>
                        </TableCell>
                        <TableCell>{evaluation.lastModified}</TableCell>
                        <TableCell>
                          <Button
                            className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                            size="sm"
                            onClick={() => handleViewEvaluation(evaluation.id)}
                          >
                            View
                          </Button>
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

    if (activeTab === "employees") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black">
              Employee Management
            </h1>
            <Button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
              disabled={isLoading}
            >
              <Plus className="h-5 w-5 mr-4" />
              Add Employee
            </Button>
          </div>

          <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
            <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-blue-600">
                Active Employees
              </h2>
              <Users className="h-15 w-15 text-blue-600" />
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading employees...</span>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No employees found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
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
                          <TableCell>{employee.position.title}</TableCell>
                          <TableCell>
                            {employee.department.department_name}
                          </TableCell>
                          <TableCell>{employee.location}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                employee.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {employee.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => setSelectedQuarter("Q1")}
                                className="bg-blue-500 text-white hover:bg-green-400 hover:text-white transition-colors duration-200"
                                disabled={isLoading}
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
                                      disabled={isDeleting === employee.employeeId || isLoading}
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
                                      <AlertDialogCancel className="border-0 bg-blue-500 hover:bg-green-400 text-white hover:text-white">
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
                  <Label htmlFor="Branch">Branch</Label>
                  <Input
                    id="Branch"
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

    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-xl transform transition-all duration-500 hover:scale-[1.01] ease-in-out">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm48 0v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2V8h4V6h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
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
                Welcome back, {user.name}
              </h1>
              <p className="text-blue-100 opacity-90">
                Here's what's happening with your employees today.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
                                disabled={isDeleting === employee.employeeId || isLoading}
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
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-blue-200">
      {/* Sidebar */}
      <div className="fixed md:relative w-full md:w-20 lg:w-64 h-full transition-all duration-300 z-30">
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

        <div
          className={`bg-white shadow-lg rounded-2xl flex flex-col h-full transition-all duration-300 transform ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
            <div className="mb-6 lg:mb-8 flex justify-center">
              <img
                src="/images/smct.png"
                alt="SMCT Logo"
                className="h-15 lg:h-17 w-auto transition-opacity duration-300"
              />
            </div>

            <nav className="space-y-1 bg-blue-100 rounded-2xl">
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
          <div className="flex flex-col items-center lg:flex-row lg:items-start gap-4 mb-8 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <Avatar className="h-14 w-14 flex-shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${user.username}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-600 font-medium">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border-2 border-white"></div>
            </div>

            <div className="text-center lg:text-left flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-lg md:text-xl truncate">
                {user.name}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-2 justify-center lg:justify-start">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                  {user.role}
                </span>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <p className="text-sm text-gray-500 mt-1 sm:mt-0 truncate">
                  {user.department || "Human Resources"}
                </p>
              </div>
            </div>
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
