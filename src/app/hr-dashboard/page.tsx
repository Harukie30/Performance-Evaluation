"use client";
import { useState, useEffect } from "react";
import { Users, BarChart3, FileText, User, CheckCircle2, Clock, ChevronDown, LogOut, Settings, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import usersData from "@/data/users.json";
import { reviewService, Review, Activity } from "@/services/reviewService";
import { useReviewData } from "@/hooks/useReviewData";
import { eventService, EVENTS } from "@/services/eventService";
import NotificationBell from "@/components/NotificationBell";
import { toast } from "sonner";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "employees", label: "Employees", icon: Users },
  { id: "reviews", label: "Reviews", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

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

// Helper to get quarter from a date
function getQuarterFromDate(dateString: string | undefined) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const month = date.getMonth();
  if (month >= 0 && month <= 2) return 'Q1';
  if (month >= 3 && month <= 5) return 'Q2';
  if (month >= 6 && month <= 8) return 'Q3';
  if (month >= 9 && month <= 11) return 'Q4';
  return 'N/A';
}

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editOpen, setEditOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "HR Manager", email: "hr@example.com" });
  const [form, setForm] = useState(profile);
  const [users, setUsers] = useState(usersData);
  const [addOpen, setAddOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: { department_name: "" },
    position: { title: "" },
    location: "",
    status: "Active",
    datehired: { date: "" },
  });
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to get relative time
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

  // Use the new hook for data fetching (no polling)
  const { reviews, activities, notifications, loading, error, refreshData } = useReviewData({
    autoRefresh: false, // No automatic polling
    initialLoad: true
  });

  // Sync local notifications with hook notifications
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // Listen for real-time updates when reviews are submitted
  useEffect(() => {
    const unsubscribeReviewSubmitted = eventService.subscribe(EVENTS.REVIEW_SUBMITTED, () => {
      console.log('Review submitted event received, refreshing data...');
      refreshData();
    });

    const unsubscribeActivityCreated = eventService.subscribe(EVENTS.ACTIVITY_CREATED, () => {
      console.log('Activity created event received, refreshing data...');
      refreshData();
    });

    const unsubscribeDataUpdated = eventService.subscribe(EVENTS.DATA_UPDATED, () => {
      console.log('Data updated event received, refreshing data...');
      refreshData();
    });

    // Cleanup event listeners on component unmount
    return () => {
      unsubscribeReviewSubmitted();
      unsubscribeActivityCreated();
      unsubscribeDataUpdated();
    };
  }, [refreshData]);

  const handleEditOpen = () => {
    setForm(profile);
    setEditOpen(true);
  };
  const handleEditSave = () => {
    setProfile(form);
    setEditOpen(false);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers([
      ...users,
      {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...newEmployee,
      },
    ]);
    setAddOpen(false);
    setNewEmployee({
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      department: { department_name: "" },
      position: { title: "" },
      location: "",
      status: "Active",
      datehired: { date: "" },
    });
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      console.log('Marking notification as read:', id);
      console.log('Current notifications:', localNotifications);
      
      // Update local notification state immediately for better UX
      setLocalNotifications(prev => {
        const updated = prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        );
        console.log('Updated notifications:', updated);
        return updated;
      });
      
      // Also call the service method for backend sync (if needed)
      await reviewService.markNotificationAsRead(id);
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert the local state change if the service call fails
      await refreshData();
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      console.log('Marking all notifications as read');
      console.log('Current notifications:', localNotifications);
      
      // Update local notification state immediately for better UX
      setLocalNotifications(prev => {
        const updated = prev.map(notification => ({ ...notification, read: true }));
        console.log('Updated notifications:', updated);
        return updated;
      });
      
      // Also call the service method for backend sync (if needed)
      await reviewService.markAllNotificationsAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Revert the local state change if the service call fails
      await refreshData();
    }
  };

  const handleViewEvaluation = (reviewId: string) => {
    if (!reviewId) {
      toast.error("Invalid review ID");
      return;
    }
    router.push(`/performance/${reviewId}`);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setUsers((prev) => prev.filter((user) => user.employeeId !== employeeId));
    setDeleteEmployeeId(null);
  };

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
              onClick={() => setActiveTab(item.id)}
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
              <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">Welcome to the HR Dashboard</h1>
              <p className="text-lg text-blue-100 font-medium">Manage employees, track reviews, and view HR analytics in one place.</p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={localNotifications}
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
                    HR
                  </div>
                  <div className="text-white">
                    <div className="font-semibold text-base leading-tight">HR Manager</div>
                    <div className="text-sm opacity-90">HR</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white opacity-70" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-0">
                <DropdownMenuItem onClick={() => setActiveTab("profile")} className="cursor-pointer hover:bg-blue-200">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setProfile({ name: "", email: "" });
                    router.push("/login");
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-blue-200 transition-shadow">
                <Users className="h-10 w-10 text-blue-500 mb-3" />
                <div className="text-3xl font-extrabold text-blue-700 mb-1">{users.length}</div>
                <div className="text-gray-600 font-semibold">Total Employees</div>
              </Card>
              <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-green-200 transition-shadow">
              <Users className="h-10 w-10 text-blue-500 mb-3" />
                <div className="text-3xl font-extrabold text-green-700 mb-1">{users.filter(u => u.status === 'Active').length}</div>
                <div className="text-gray-600 font-semibold">Active Employees</div>
              </Card>
              <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-yellow-200 transition-shadow">
                <Clock className="h-10 w-10 text-yellow-500 mb-3" />
                <div className="text-3xl font-extrabold text-yellow-700 mb-1">{reviews.filter(r => r.status === 'Pending').length}</div>
                <div className="text-gray-600 font-semibold">Pending Reviews</div>
              </Card>
              <Card className="p-8 flex flex-col items-center justify-center rounded-2xl shadow-xl border-0 bg-white hover:shadow-purple-200 transition-shadow">
              <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
                <div className="text-3xl font-extrabold text-purple-700 mb-1">{reviews.filter(r => r.status === 'Completed').length}</div>
                <div className="text-gray-600 font-semibold">Completed Reviews</div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mb-10 p-8 rounded-2xl shadow-xl border-0 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-700">Recent Activity</h2>
                <Button 
                  onClick={refreshData}
                  disabled={loading}
                  className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black font-semibold px-4 py-2 rounded-lg"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                  <span className="text-gray-600">Loading recent activities...</span>
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity, index) => (
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
                              {activity.text}
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
                                {activity.type === 'evaluation_completed' ? 'Evaluation Completed' : 'Evaluation Started'}
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
                                Performance Review
                              </span>
                              <span>•</span>
                              <span>HR Dashboard</span>
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
                      {index < activities.length - 1 && index < 4 && (
                        <div className="absolute left-6 top-16 w-0.5 h-4 bg-gradient-to-b from-blue-300 to-transparent"></div>
                      )}
                    </div>
                  ))}

                  {/* View All Button */}
                  {activities.length > 5 && (
                    <div className="text-center pt-4">
                      <Button 
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        View All {activities.length} Activities
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
                    When evaluators complete performance reviews, they will appear here as recent activities for your HR dashboard.
                  </p>
                </div>
              )}

              {/* Activity Summary */}
              {activities.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {activities.filter(a => a.type === 'evaluation_completed').length} Completed
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {activities.filter(a => a.type === 'evaluation_started').length} In Progress
                      </span>
                    </div>
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Employees Tab Content */}
        {activeTab === "employees" && (
          <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-blue-700">Employees</h2>
              <Button className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black font-semibold px-6 py-2 rounded-lg" onClick={() => setAddOpen(true)}>
                Add Employee
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Employee ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Position</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date Hired</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{user.employeeId}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{user.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{user.department?.department_name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{user.position?.title}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{user.location}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{user.status}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{user.datehired?.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteEmployeeId(user.employeeId)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Employee</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <Input value={newEmployee.employeeId} onChange={e => setNewEmployee(emp => ({ ...emp, employeeId: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input value={newEmployee.name} onChange={e => setNewEmployee(emp => ({ ...emp, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input type="email" value={newEmployee.email} onChange={e => setNewEmployee(emp => ({ ...emp, email: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <Input value={newEmployee.department.department_name} onChange={e => setNewEmployee(emp => ({ ...emp, department: { department_name: e.target.value } }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <Input value={newEmployee.position.title} onChange={e => setNewEmployee(emp => ({ ...emp, position: { title: e.target.value } }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <Input value={newEmployee.location} onChange={e => setNewEmployee(emp => ({ ...emp, location: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Input value={newEmployee.status} onChange={e => setNewEmployee(emp => ({ ...emp, status: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Hired</label>
                    <Input type="date" value={newEmployee.datehired.date} onChange={e => setNewEmployee(emp => ({ ...emp, datehired: { date: e.target.value } }))} required />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black">Add</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteEmployeeId} onOpenChange={() => setDeleteEmployeeId(null)}>
              <DialogContent className="max-w-md border-0 ">
                <DialogHeader>
                  <DialogTitle>Delete Employee</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this employee?</p>
                <DialogFooter>
                  <Button className="bg-blue-500 text-white hover:bg-green-400" variant="secondary" onClick={() => setDeleteEmployeeId(null)}>Cancel</Button>
                  <Button className="bg-red-500 hover:bg-red-700" variant="destructive" onClick={() => handleDeleteEmployee(deleteEmployeeId!)}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        )}

        {/* Reviews Tab Content */}
        {activeTab === "reviews" && (
          <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Reviews</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Employee ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Employee</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">QuarterReview</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {reviews.map((review) => {
                    console.log('QuarterReview debug:', review.reviewDate, review);
                    return (
                      <tr key={review.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{review.employeeId}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{review.employeeName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${review.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{review.status}</span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{getQuarterFromDate(review.reviewDate)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{review.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white max-w-xl mx-auto">
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-yellow-200 flex items-center justify-center text-4xl font-bold text-blue-700 shadow">
                HR
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                <p className="text-gray-600 mb-1">{profile.email}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Role: HR</span>
              </div>
              <Button className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black font-semibold px-6 py-2 rounded-lg mt-4" onClick={handleEditOpen}>Edit Profile</Button>
            </div>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-yellow-400 hover:text-black">Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        )}
      </main>
    </div>
  );
} 