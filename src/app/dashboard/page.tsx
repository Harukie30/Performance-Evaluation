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
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const currentYear = new Date().getFullYear();
  const quarters = [
    { id: 'Q1', label: 'First Quarter', months: 'Jan - Mar' },
    { id: 'Q2', label: 'Second Quarter', months: 'Apr - Jun' },
    { id: 'Q3', label: 'Third Quarter', months: 'Jul - Sep' },
    { id: 'Q4', label: 'Fourth Quarter', months: 'Oct - Dec' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Quarters</Button>
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
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    review?.status === 'completed' ? 'bg-green-100 text-green-800' :
                    review?.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {review?.status || 'Not Started'}
                  </span>
                  {review?.date && (
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const router = useRouter();

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

  if (!user) {
    return null;
  }

  // Calculate statistics
  const totalEvaluations = evaluations.length;
  const completedEvaluations = evaluations.filter(e => e.status === "completed").length;
  const pendingEvaluations = evaluations.filter(e => e.status === "draft" || e.status === "submitted").length;
  const completionRate = totalEvaluations > 0 ? (completedEvaluations / totalEvaluations) * 100 : 0;

  const renderContent = () => {
    if (activeTab === "evaluations") {
      return (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-white">
            <TabsTrigger value="pending">Pending Evaluations</TabsTrigger>
            <TabsTrigger value="completed">Completed Evaluations</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
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

          <TabsContent value="completed">
            <Card>
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
          <TabsList className="bg-white">
            <TabsTrigger value="active">Active Employees</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Employees</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
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
            <Card>
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
      <>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Evaluations</p>
                <h3 className="text-2xl font-bold mt-1">{totalEvaluations}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <h3 className="text-2xl font-bold mt-1">{completedEvaluations}</h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <h3 className="text-2xl font-bold mt-1">{pendingEvaluations}</h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <h3 className="text-2xl font-bold mt-1">{completionRate.toFixed(1)}%</h3>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === "evaluation" ? "bg-blue-100" :
                    activity.type === "update" ? "bg-yellow-100" :
                    "bg-green-100"
                  }`}>
                    {activity.type === "evaluation" ? (
                      <FileText className="h-5 w-5 text-blue-600" />
                    ) : activity.type === "update" ? (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-600">
                      {activity.employeeName} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <Button 
              variant={activeTab === "dashboard" ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => handleTabChange("dashboard")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === "evaluations" ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => handleTabChange("evaluations")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Evaluations
            </Button>
            <Button 
              variant={activeTab === "employees" ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => handleTabChange("employees")}
            >
              <Users className="mr-2 h-4 w-4" />
              Employees
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
              <p className="text-gray-600">
                {activeTab === "dashboard" 
                  ? "Here's an overview of your evaluations" 
                  : activeTab === "evaluations"
                  ? "Manage your evaluations"
                  : "Manage your employees"}
              </p>
            </div>
            {activeTab === "dashboard" && (
              <Button onClick={handleNewEvaluation} className="bg-blue-600 hover:bg-blue-700">
                New Evaluation
              </Button>
            )}
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
} 