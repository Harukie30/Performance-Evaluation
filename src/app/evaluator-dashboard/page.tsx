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
  Settings,
  FileText,
  XIcon,
  MenuIcon,
  UserPlus,
  UserMinus,
  Plus,
  Eye,
  Loader2,
  Search,
  ArrowUpDown,
  Printer,
  Calendar,
  Download,
  Share2,
  Star,
  Target,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Code,
  Trophy,
  GraduationCap,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { QuarterlyReviewModal } from "@/components/QuarterlyReviewModal";
import RecentActivityModal from "@/components/RecentActivityModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";
import { reviewAPI, authAPI, employeeAPI } from "@/services/api";
import usersData from '@/data/users.json';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  ForRegular?: "Q1 2023" | "Q2 2023" | "Q3 2023" | "Q4 2023" | "Q1 2024" | "Q2 2024";
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

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export default function EvaluatorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [openQuarterModal, setOpenQuarterModal] = useState<null | { employeeId: string; quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' }>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<null | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationResult | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const router = useRouter();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "evaluations", label: "My Evaluations", icon: FileText },
    { id: "employees", label: "Employees", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.me();
        const userData = response.data;
        
        if (!userData || userData.role.toLowerCase() !== 'evaluator') {
          console.log("Unauthorized access, redirecting to login");
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

  // Load evaluations and recent activities
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load evaluations
        const evaluationsResponse = await fetch('/api/performance-review');
        if (evaluationsResponse.ok) {
          const evaluationsData = await evaluationsResponse.json();
          setEvaluations(evaluationsData);
        }

        // Load recent activities
        const activitiesResponse = await fetch('/api/recent-activities');
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const verifyEmployeeData = (employees: Employee[]) => {
    console.group('Employee Data Verification');
    console.log('Total employees:', employees.length);
    
    // Check for required fields
    const validEmployees = employees.every(emp => {
      const isValid = emp.employeeId && emp.name && emp.email && emp.department?.department_name && emp.position?.title;
      if (!isValid) {
        console.warn('Invalid employee data:', emp);
      }
      return isValid;
    });
    
    // Count by department
    const departmentCount = employees.reduce((acc, emp) => {
      const dept = emp.department.department_name;
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Department distribution:', departmentCount);
    console.log('All employees valid:', validEmployees);
    console.groupEnd();
    
    return validEmployees;
  };

  const loadEmployees = async () => {
    try {
      console.group('Loading Employees');
      console.log('Starting employee data load...');
      
      // Use the imported users data instead of API call
      const employees = usersData as Employee[];
      console.log('Raw employee data loaded:', employees);
      
      if (!employees || employees.length === 0) {
        console.warn('No employees found in the data');
        toast.warning('No employees found');
        return;
      }

      // Verify the data structure
      const isValid = verifyEmployeeData(employees);
      if (!isValid) {
        console.error('Employee data validation failed');
        toast.error('Employee data validation failed');
        return;
      }

      // Filter active employees
      const activeEmployees = employees.filter(emp => emp.status === "Active");
      console.log('Active employees:', activeEmployees.length);
      
      setEmployees(employees);
      console.log('Successfully set employees in state');
      
      // Show success message with details
      toast.success(`Loaded ${employees.length} employees (${activeEmployees.length} active)`);
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
      console.group('Initial Data Load');
      console.log('User authenticated:', user);
      console.log('Starting data load...');
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
      router.push(`/performance?employeeId=${encodeURIComponent(employee.employeeId)}&employeeName=${encodeURIComponent(employee.id.toString())}&department=${encodeURIComponent(employee.department.department_name)}&position=${encodeURIComponent(employee.position.title)}`);
    } else {
      router.push('/performance');
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
      value: employees.length - evaluations.filter((e) => e.status === "completed").length,
      icon: <Clock className="h-6 w-6" />,
      color: "bg-yellow-100 text-yellow-600",
      description: "Employees awaiting evaluation",
    },
    {
      title: "Completion Rate",
      value: employees.length > 0 
        ? `${((evaluations.filter((e) => e.status === "completed").length / employees.length) * 100).toFixed(1)}%` 
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
  const departments = Array.from(new Set(employees.map(emp => emp.department.department_name)));

  // Filter and sort employees
  const filteredAndSortedEmployees = employees
    .filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = selectedDepartment === "all" || 
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
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #1e40af; margin-bottom: 30px;">Performance Review - ${selectedQuarter}</h1>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Employee Information</h2>
          <p><strong>Name:</strong> ${selectedEmployee?.name}</p>
          <p><strong>Position:</strong> ${selectedEmployee?.position.title}</p>
          <p><strong>Department:</strong> ${selectedEmployee?.department.department_name}</p>
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
            "Demonstrated exceptional performance in achieving sales targets while maintaining high customer satisfaction. 
            The implementation of new protocols has significantly improved team efficiency. 
            Looking forward to continued growth in the next quarter."
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

    const printWindow = window.open('', '_blank');
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
    try {
      console.log('Fetching evaluation details for:', evaluation.id);
      const response = await fetch(`/api/performance-review/${evaluation.id}`);
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch evaluation details');
      }
      
      const data = await response.json();
      console.log('Received evaluation data:', data);
      
      setSelectedEvaluation(data);
      setShowResultsModal(true);
    } catch (error) {
      console.error('Error fetching evaluation details:', error);
      toast.error("Failed to load evaluation details");
    }
  };

  const ResultsModal = ({ evaluation, onClose }: { evaluation: EvaluationResult | null, onClose: () => void }) => {
    if (!evaluation) return null;

    return (
      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <h3 className="text-xl font-semibold text-gray-800">Performance Scores</h3>
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
                      <TableCell>{(score.score * score.weight / 100).toFixed(2)}</TableCell>
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
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderContent = () => {
    if (!user) return null;

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
                  <Label htmlFor="yourName" className="text-gray-700 font-medium">
                    Your Name
                  </Label>
                  <Input
                    id="yourName"
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">
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
                  <Label htmlFor="emailAddress" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="emailAddress"
                      type="email"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
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
                onClick={() => handleProfileUpdate(user)}
                className="px-13 py-2 bg-blue-600 text-white hover:bg-yellow-400 hover:text-black transition-colors duration-200"
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    if (activeTab === "employees") {
      return (
        <Tabs defaultValue="active" className="space-y-4">
          <div>
            <h2 className="font-bold text-3xl">Employees</h2>
          </div>
          <TabsList className="bg-gray-200 p-1 rounded-lg">
            <TabsTrigger
              value="active"
              className="flex-1 py-2 px-4 rounded-md text-gray-700 data-[state=active]:bg-yellow-300 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >
              Active Employees
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" key="active">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
              <div className="p-6 border-p bg-yellow-200 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-blue-600">Active Employees</h2>
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
                              className="bg-blue-500 text-white hover:bg-yellow-500 hover:text-black"
                              size="sm"
                              onClick={() => handleViewQuarters(employee)}
                            >
                              View Quarters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>

            {/* Quarters Modal */}
            <Dialog open={isQuarterModalOpen} onOpenChange={setIsQuarterModalOpen}>
              <DialogContent className="w-full max-w-4xl max-h-[97vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50">
                <DialogHeader className="space-y-4 pb-6 border-b border-gray-100">
                  <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Performance Review Summary
                  </DialogTitle>
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => setIsQuarterModalOpen(false)} className="hover:bg-gray-100">
                      <X className="h-4 w-4 mr-2" />
                      Close
                    </Button>
                    <Button variant="ghost" onClick={handlePrintReview} className="hover:bg-gray-100">
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
                        variant={selectedQuarter === quarter ? "default" : "outline"}
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
                            <AvatarImage src={`https://avatar.vercel.sh/${selectedEmployee?.name}`} />
                            <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
                              {selectedEmployee?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{selectedEmployee?.name}</h3>
                            <p className="text-lg text-blue-600 font-medium">{selectedEmployee?.position.title}</p>
                            <p className="text-gray-600">{selectedEmployee?.department.department_name}</p>
                          </div>
                        </div>
                      </div>

                      {/* Overall Rating */}
                      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Overall Rating</h3>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-8 w-8 ${
                                  star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            4.5 / 5.0
                          </div>
                        </div>
                        <p className="text-gray-600 mt-4 text-lg">Performance exceeds expectations in most areas</p>
                      </div>

                      {/* Performance Metrics */}
                      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-3">
                                <span className="font-semibold text-gray-700">Sales Target Achievement</span>
                                <span className="font-bold text-blue-600">85%</span>
                              </div>
                              <Progress value={85} className="h-2.5 bg-gray-100" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-3">
                                <span className="font-semibold text-gray-700">Customer Satisfaction</span>
                                <span className="font-bold text-blue-600">92%</span>
                              </div>
                              <Progress value={92} className="h-2.5 bg-gray-100" />
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-3">
                                <span className="font-semibold text-gray-700">Project Completion</span>
                                <span className="font-bold text-blue-600">78%</span>
                              </div>
                              <Progress value={78} className="h-2.5 bg-gray-100" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-3">
                                <span className="font-semibold text-gray-700">Team Collaboration</span>
                                <span className="font-bold text-blue-600">90%</span>
                              </div>
                              <Progress value={90} className="h-2.5 bg-gray-100" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Key Achievements */}
                      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Achievements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Sales Target Exceeded</p>
                              <p className="text-gray-600 mt-1">Exceeded quarterly sales target by 15%</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Customer Service Protocol</p>
                              <p className="text-gray-600 mt-1">Successfully implemented new customer service protocol</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Team Training</p>
                              <p className="text-gray-600 mt-1">Led team training session on new software implementation</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Process Improvement</p>
                              <p className="text-gray-600 mt-1">Streamlined workflow resulting in 20% efficiency increase</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Next Quarter Goals */}
                      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Next Quarter Goals</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Customer Retention</p>
                              <p className="text-gray-600 mt-1">Target: 95% retention rate</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Sales Strategy</p>
                              <p className="text-gray-600 mt-1">Implement new digital sales strategy</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Training Program</p>
                              <p className="text-gray-600 mt-1">Complete leadership development course</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Process Optimization</p>
                              <p className="text-gray-600 mt-1">Implement new workflow automation tools</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Evaluator Comments */}
                      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Evaluator Comments</h3>
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                          <p className="text-gray-700 text-lg leading-relaxed">
                            "Demonstrated exceptional performance in achieving sales targets while maintaining high customer satisfaction. 
                            The implementation of new protocols has significantly improved team efficiency. 
                            Looking forward to continued growth in the next quarter."
                          </p>
                          <div className="mt-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">JS</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">John Smith</p>
                              <p className="text-gray-600">Department Manager</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      );
    }

    if (activeTab === "evaluations") {
      return (
        <Tabs defaultValue="total" className="space-y-4">
          <div>
            <h2 className="font-bold text-3xl">Employee Evaluations</h2>
          </div>
          <TabsList className="space-x-4 bg-gray-200 p-1 rounded-lg">
            <TabsTrigger
              value="total"
              className="flex-1 py-2 px-4 rounded-md text-gray-700 data-[state=active]:bg-yellow-400 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >
              Total Employees
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex-1 py-2 px-4 rounded-md text-gray-700 data-[state=active]:bg-yellow-400 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >
              Completed Evaluations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="total" key="total">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-p bg-yellow-200 border-blue-500 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-blue-600">Total Employees</h2>
                <Users className="h-15 w-15 text-blue-600" />
              </div>

              {/* Search and Filter Section */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select
                      value={selectedDepartment}
                      onValueChange={setSelectedDepartment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Employee Name
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center gap-2">
                        Department
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("position")}
                    >
                      <div className="flex items-center gap-2">
                        Position
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEmployees
                    .filter((employee: Employee) => {
                      // Only show employees who haven't been evaluated yet
                      const hasEvaluation = evaluations.some(
                        (evaluation) => evaluation.employeeId === employee.employeeId && evaluation.status === "completed"
                      );
                      return !hasEvaluation;
                    })
                    .map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.department.department_name}</TableCell>
                        <TableCell>{employee.position.title}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            employee.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {employee.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                              size="sm"
                              onClick={() => handleNewEvaluation(employee)}
                            >
                              Evaluate
                            </Button>
                          </div>
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
                <h2 className="text-3xl font-bold text-green-700">Completed Evaluations</h2>
                <CheckCircle2 className="h-15 w-15 text-green-600" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>For Regular</TableHead>
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
                        <TableCell>{evaluation.ForRegular}</TableCell>
                        <TableCell>{evaluation.status}</TableCell>
                        <TableCell>{evaluation.lastModified}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              
                              size="sm"
                              onClick={() => router.push(`/performance/${evaluation.id}`)}
                              className="flex items-center gap-2 bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
                            >
                              <Eye className="h-4 w-4" />
                              Review Summary
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
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm48 0v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2V8h4V6h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <img
              src="/images/dataa.png"
              alt="SMCT Logo"
              className="h-15 lg:h-15 w-auto transition-opacity duration-300"
            />

            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
              <p className="text-blue-100 opacity-90">
                Here's what's happening with your evaluations today.
              </p>
            </div>

            <Button
              onClick={() => handleNewEvaluation()}
              className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              New Evaluation
            </Button>
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
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
                  <p className="text-xs text-gray-500 opacity-90">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <Card className="overflow-hidden bg-white border-0 shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h2 className="text-2xl font-semibold">Recent Activity</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-blue-500 text-white hover:text-white hover:bg-red-500 group transition-all duration-200"
                  onClick={() => setIsActivityModalOpen(true)}
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No recent activities to display
                  </div>
                ) : (
                  recentActivities.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      className="group flex items-start gap-4 p-4 rounded-lg border border-gray-300 hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.type === "evaluation"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "update"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}>
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
                          <p className="text-sm text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.employeeName}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

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
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <XIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>

        {/* Sidebar Container */}
        <div className={`bg-white shadow-lg rounded-2xl flex flex-col h-full transition-all duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
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

          {/* Footer */}
          <div className="p-3 lg:p-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full justify-center lg:justify-start text-red-600 hover:text-white hover:bg-red-500 group transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="ml-0 lg:ml-2 hidden lg:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-blue-200">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
} 