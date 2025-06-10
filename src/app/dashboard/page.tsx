"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usersData from "@/data/users.json";
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
  Circle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuarterlyReviewModal } from '@/components/QuarterlyReviewModal';
import RecentActivityModal from "@/components/RecentActivityModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
  department: string;
  permissions: string[];
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
  quarterlyReviews?: {
    Q1?: { status: string; date?: string };
    Q2?: { status: string; date?: string };
    Q3?: { status: string; date?: string };
    Q4?: { status: string; date?: string };
  };
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

interface RecentActivity {
  id: string;
  type: "evaluation" | "update" | "completion";
  description: string;
  timestamp: string;
  employeeName: string;
}

const QuarterViewModal = ({ employee }: { employee: Employee }) => {
  const [selectedQuarter, setSelectedQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | null>(null);
  const currentYear = new Date().getFullYear();
  const quarters = [
    { id: 'Q1', label: 'First Quarter', months: 'Jan - Mar' },
    { id: 'Q2', label: 'Second Quarter', months: 'Apr - Jun' },
    { id: 'Q3', label: 'Third Quarter', months: 'Jul - Sep' },
    { id: 'Q4', label: 'Fourth Quarter', months: 'Oct - Dec' },
  ];

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button  className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black" size="lg">View Quarters</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quarterly Reviews - {employee.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {quarters.map((quarter) => {
              const review = employee.quarterlyReviews?.[quarter.id as keyof typeof employee.quarterlyReviews];
              return (
                <div key={quarter.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{quarter.label}</h4>
                    <p className="text-sm text-gray-500">{quarter.months} {currentYear}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuarter(quarter.id as 'Q1' | 'Q2' | 'Q3' | 'Q4')}
                      disabled={!review?.status || review.status === 'not_started'}
                    >
                      View Details
                    </Button>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      review?.status === 'completed' ? 'bg-green-100 text-green-800' :
                      review?.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {review?.status || 'Not Started'}
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "evaluations", label: "Evaluations", icon: FileText },
    { id: "employees", label: "Employees", icon: Users },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const loadEmployees = async () => {
    try {
      // Add quarterly reviews to employee data with more realistic mock data
      const employeesWithReviews = usersData.map((employee: Employee, index: number) => {
        // Generate different review statuses based on employee index to create variety
        const getQuarterStatus = (quarter: number) => {
          const statuses = ['completed', 'in_progress', 'not_started'];
          const statusIndex = (index + quarter) % 3;
          return statuses[statusIndex];
        };

        // Generate dates for completed and in-progress reviews
        const getReviewDate = (quarter: number) => {
          const status = getQuarterStatus(quarter);
          if (status === 'not_started') return undefined;
          
          const currentDate = new Date();
          const month = (quarter - 1) * 3 + 1; // Q1: Jan(1), Q2: Apr(4), Q3: Jul(7), Q4: Oct(10)
          const reviewDate = new Date(currentDate.getFullYear(), month - 1, 15);
          
          // For completed reviews, set date in the past
          if (status === 'completed') {
            reviewDate.setDate(reviewDate.getDate() - 15);
          }
          
          return reviewDate.toISOString();
        };

        return {
          ...employee,
          quarterlyReviews: {
            Q1: { 
              status: getQuarterStatus(1),
              date: getReviewDate(1)
            },
            Q2: { 
              status: getQuarterStatus(2),
              date: getReviewDate(2)
            },
            Q3: { 
              status: getQuarterStatus(3),
              date: getReviewDate(3)
            },
            Q4: { 
              status: getQuarterStatus(4),
              date: getReviewDate(4)
            }
          }
        };
      });

      setEmployees(employeesWithReviews);

      // Create evaluations based on employees data
      const currentDate = new Date();
      const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
      const currentYear = currentDate.getFullYear();
      const reviewPeriod = `Q${currentQuarter} ${currentYear}`;

      const initialEvaluations = employeesWithReviews.map((employee: Employee, index: number) => ({
        id: `eval-${index + 1}`,
        employeeId: employee.employeeId,
        employeeName: employee.name,
        department: employee.department.department_name,
        reviewPeriod,
        status: (index % 3 === 0 ? "completed" : index % 3 === 1 ? "submitted" : "draft") as "completed" | "submitted" | "draft",
        lastModified: new Date(Date.now() - index * 86400000).toISOString().split('T')[0]
      }));

      const recentActivities = employeesWithReviews.slice(0, 3).map((employee: Employee, index: number) => ({
        id: `act-${index + 1}`,
        type: (index === 0 ? "evaluation" : index === 1 ? "update" : "completion") as "evaluation" | "update" | "completion",
        description: index === 0 ? "New evaluation created" : 
                    index === 1 ? "Evaluation updated" : 
                    "Evaluation completed",
        timestamp: new Date(Date.now() - index * 86400000).toLocaleString(),
        employeeName: employee.name
      }));

      setEvaluations(initialEvaluations);
      setRecentActivities(recentActivities);
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
    loadEmployees();
  }, [router]);

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

  const handleLogout = () => {
    // Clear cookies and redirect to login
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) {
    return null;
  }

  // Calculate statistics
  const totalEvaluations = evaluations.length;
  const completedEvaluations = evaluations.filter(e => e.status === "completed").length;
  const pendingEvaluations = evaluations.filter(e => e.status === "draft" || e.status === "submitted").length;
  const completionRate = totalEvaluations > 0 ? (completedEvaluations / totalEvaluations) * 100 : 0;

  const stats = [
    { 
      title: "Total Evaluations", 
      value: totalEvaluations, 
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      description: "Total number of evaluations"
    },
    { 
      title: "Completed", 
      value: completedEvaluations, 
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      description: "Successfully completed evaluations"
    },
    { 
      title: "Pending", 
      value: pendingEvaluations, 
      icon: <Clock className="h-6 w-6" />,
      color: "bg-yellow-100 text-yellow-600",
      description: "Evaluations awaiting completion"
    },
    { 
      title: "Completion Rate", 
      value: `${completionRate.toFixed(1)}%`, 
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      description: "Overall completion percentage"
    }
  ];

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="max-w-4xl mx-auto py-8">
          <Card className="p-8 bg-white shadow-xl rounded-lg border-none">
            {/* Header for Boards (if applicable, otherwise omit or adapt) */}
            <div className="flex items-center space-x-2 mb-8">
              {/* Assuming you might have a home icon or similar for 'Boards' */}
              {/* <Home className="h-5 w-5 text-gray-500" /> */}
              {/* <p className="text-gray-700 font-semibold">Boards</p> */}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
            <p className="text-gray-500 mb-8">Edit your name, avatar etc.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                {/* Your Name */}
                <div>
                  <Label htmlFor="yourName" className="text-gray-700 font-medium">Your Name</Label>
                  <Input
                    id="yourName"
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="password"
                      type="password"
                      value="********" // Placeholder for password
                      disabled // Passwords are not directly editable here
                      className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button variant="link" className="text-blue-500 hover:underline p-0 h-auto">Change</Button>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <Label htmlFor="emailAddress" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="emailAddress"
                      type="email"
                      value={user.username} // Assuming username is email
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                      className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button variant="link" className="text-blue-500 hover:underline p-0 h-auto">Change</Button>
                  </div>
                </div>

                {/* Delete Your Account */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-red-500 font-medium mb-1">Delete Your Account</h3>
                  <p className="text-sm text-gray-500">You will receive an email to confirm your decision. Please note, that all boards you have created will be permanently erased.</p>
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="md:col-span-1 flex flex-col items-center justify-start pt-14">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-gray-400" /> {/* Placeholder avatar icon */}
                </div>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">Upload a picture</Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <Button variant="outline" className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Cancel</Button>
              <Button onClick={() => handleProfileUpdate(user)} className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">Save</Button>
            </div>
          </Card>
        </div>
      );
    }

    if (activeTab === "evaluations") {
      return (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="space-x-4 bg-gray-200 ">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >Pending Evaluations</TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black hover:bg-blue-400 hover:text-white transition-colors duration-200"
            >Completed Evaluations</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 ">Pending Evaluations</h2>
                <FileText className="h-15 w-15 text-blue-600 " />
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
                            {evaluation.status}
                          </span>
                        </TableCell>
                        <TableCell>{evaluation.lastModified}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
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

          <TabsContent value="completed">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Completed Evaluations</h2>
                <CheckCircle2 className="h-15 w-15 text-green-600" />
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
                            variant="outline"
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
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="bg-blue-500 text-white">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-yellow-300 data-[state=active]:text-black hover:bg-blue-400 transition-colors duration-200"
            >Active Employees</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Active Employees</h2>
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
                    <TableHead>Quarter View</TableHead>
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
                          <QuarterViewModal employee={employee} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="inactive">
            <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Inactive Employees</h2>
                <Users className="h-6 w-6 text-gray-600" />
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
                    <TableHead>Quarter View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees
                    .filter((employee) => employee.status !== "Active")
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
                          <QuarterViewModal employee={employee} />
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
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm48 0v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2v-4h4v-2h-4zm0-18v-4H70v4H66v2h4v4h2V8h4V6h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4zm-24 0v-4h-2v4h-4v2h4v4h2V6h4V4h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
        <img
          src="/images/dataa.png"
          alt="SMCT Logo"
          className="h-15 lg:h-15 w-auto transition-opacity duration-300"
        />
      
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
              <p className="text-blue-100 opacity-90">Here's what's happening with your evaluations today.</p>
            </div>
             {/* Logo */}
      
            <Button
              onClick={handleNewEvaluation}
              className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              New Evaluation
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-none bg-white rounded-xl transform hover:-translate-y-1">
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
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden bg-white border-0 shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                  onClick={() => setIsActivityModalOpen(true)}
                >
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {recentActivities.slice(0, 3).map((activity) => (
                  <div 
                    key={activity.id} 
                    className="group flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <div className={`p-2 rounded-full ${
                      activity.type === "evaluation" ? "bg-blue-100 text-blue-600" :
                      activity.type === "update" ? "bg-yellow-100 text-yellow-600" :
                      "bg-green-100 text-green-600"
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
                          {new Date(activity.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.employeeName}
                      </p>
                    </div>
                  </div>
                ))}
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
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed md:relative w-full md:w-20 lg:w-64 h-full transition-all duration-300 z-30">
  {/* Mobile Toggle Button */}
  <button 
    className="md:hidden absolute top-4 right-4 p-2 z-40 text-gray-700 hover:bg-gray-100 rounded-full"
    onClick={toggleSidebar}
  >
    {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
  </button>

  {/* Sidebar Container */}
  <div className={`bg-white shadow-lg rounded-2xl flex flex-col h-full transition-all duration-300 transform ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  }`}>
    <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
      

      {/* Logo */}
      <div className="mb-6 lg:mb-8 flex justify-center  bg-gradient-blue-500">
        <img
          src="/images/smct.png"
          alt="SMCT Logo"
          className="h-10 lg:h-12 w-auto transition-opacity duration-300"
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
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
            <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
              activeTab === item.id 
                ? "text-blue-600" 
                : "text-gray-500 group-hover:text-blue-600"
            }`} />
            <span className="ml-0 lg:ml-2 hidden lg:inline-block transition-all duration-200">
              {item.label}
            </span>
          </Button>
        ))}
      </nav>
    </div>

    
{/* User Profile */}
<div className="flex flex-col items-center lg:items-start lg:flex-row lg:space-x-4 mb-6 lg:mb-8">
        <Avatar className="h-12 w-12 border-2 border-blue-400 flex-shrink-0">
          <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="mt-3 lg:mt-0 text-center lg:text-left flex-1 min-w-0 hidden lg:block">
          <h2 className="font-semibold text-gray-900 truncate text-sm md:text-base">
            {user.name}
          </h2>
          <p className="text-xs text-gray-500 truncate">{user.role}</p>
        </div>
      </div>
{/* Footer */}
    <div className="p-3 lg:p-4 border-t border-gray-100">
      <Button
        variant="ghost"
        className="w-full justify-center lg:justify-start text-red-600 hover:text-red-700 hover:bg-red-50 group transition-all duration-200"
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
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 