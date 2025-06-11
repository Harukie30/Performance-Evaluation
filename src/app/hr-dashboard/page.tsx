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
import { 
  Users, 
  UserPlus,
  UserMinus,
  FileText,
  LogOut,
  Settings,
  MenuIcon,
  XIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
  department: string;
  permissions: string[];
}

export default function HRDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
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
  const router = useRouter();

  const navItems = [
    { id: "employees", label: "Employees", icon: Users },
    { id: "evaluations", label: "Evaluations", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      // Simulate API call
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load employees:', error);
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    try {
      // Simulate API call
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) throw new Error('Failed to add employee');

      toast.success('Employee added successfully');
      setIsAddEmployeeOpen(false);
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        location: "",
      });
      loadEmployees();
    } catch (error) {
      toast.error('Failed to add employee');
      console.error('Error adding employee:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      // Simulate API call
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      toast.success('Employee deleted successfully');
      loadEmployees();
    } catch (error) {
      toast.error('Failed to delete employee');
      console.error('Error deleting employee:', error);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-blue-200">
      {/* Sidebar */}
      <div className="fixed md:relative w-full md:w-20 lg:w-64 h-full transition-all duration-300 z-30">
        <button 
          className="md:hidden absolute top-4 right-4 p-2 z-40 text-gray-700 hover:bg-yellow-400 rounded-full"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>

        <div className={`bg-yellow-100 shadow-lg rounded-2xl flex flex-col h-full transition-all duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
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
                  variant="ghost"
                  className="w-full justify-center lg:justify-start group transition-all duration-200 py-3 lg:py-2"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-blue-600" />
                  <span className="ml-0 lg:ml-2 hidden lg:inline-block">
                    {item.label}
                  </span>
                </Button>
              ))}
            </nav>
          </div>

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
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">HR Dashboard</h1>
            <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEmployee.location}
                      onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>Add Employee</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border-none">
            <div className="p-6 border-p bg-yellow-200 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-blue-600">Employee Management</h2>
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
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department.department_name}</TableCell>
                    <TableCell>{employee.position.title}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.location}</TableCell>
                    <TableCell>{employee.datehired.date}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-red-600 hover:text-white hover:bg-red-500"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the employee
                              and remove their data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEmployee(employee.employeeId)}
                              className="bg-red-500 text-white hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
} 