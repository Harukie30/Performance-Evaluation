"use client";
import { useState, useEffect } from "react";
import { Users, BarChart3, FileText, User, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import usersData from "@/data/users.json";
import { reviewService, Review, Activity } from "@/services/reviewService";
import NotificationBell from "@/components/NotificationBell";

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

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editOpen, setEditOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "HR Manager", email: "hr@example.com" });
  const [form, setForm] = useState(profile);
  const [users, setUsers] = useState(usersData);
  const [addOpen, setAddOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
  const router = useRouter();

  useEffect(() => {
    // Subscribe to reviews and activities from the service
    const reviewSubscription = reviewService.reviews$.subscribe(setReviews);
    const activitySubscription = reviewService.activities$.subscribe(setActivities);

    // When activities update, create notifications from them
    const notificationSubscription = reviewService.activities$.subscribe(
      (newActivities) => {
        const newNotifications = newActivities.map((activity) => ({
          id: activity.id,
          type: activity.type,
          title: "Evaluation Completed",
          message: activity.text,
          timestamp: activity.timestamp,
          read: false,
        }));
        setNotifications(newNotifications);
      }
    );

    // Clean up subscriptions on component unmount
    return () => {
      reviewSubscription.unsubscribe();
      activitySubscription.unsubscribe();
      notificationSubscription.unsubscribe();
    };
  }, []);

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

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
        {/* Spacer to push profile to mid-bottom */}
        <div className="flex-1" />
        {/* Profile summary in sidebar */}
        <div
          className="flex flex-col items-center gap-2 mb-2 cursor-pointer rounded-xl p-4 bg-gradient-to-br from-blue-50 to-yellow-50 hover:bg-blue-100 transition-all"
          onClick={() => setActiveTab("profile")}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-200 to-yellow-200 flex items-center justify-center text-2xl font-bold text-blue-700 shadow">
            HR
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 text-base leading-tight">HR Manager</div>
            <div className="text-xs text-blue-600 font-medium">HR</div>
          </div>
        </div>
        
        {/* Logout Button */}
        <Button
          className="mt-2 w-full bg-red-500 text-white hover:bg-red-600 font-semibold rounded-xl py-3"
          onClick={() => {
            setProfile({ name: "", email: "" });
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-yellow-400 shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">Welcome to the HR Dashboard</h1>
              <p className="text-lg text-blue-100 font-medium">Manage employees, track reviews, and view HR analytics in one place.</p>
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
            <img src="/images/hr-illustration.svg" alt="HR Illustration" className="h-28 hidden md:block" />
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
              <h2 className="text-2xl font-bold text-blue-700 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map(activity => (
                    <div key={activity.id} className="flex items-center gap-4 p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <div className="font-semibold text-gray-800">{activity.text}</div>
                        <div className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <div>
                      <div className="font-semibold text-gray-800">No recent activities yet.</div>
                      <div className="text-xs text-gray-500">Your HR activities will appear here.</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}

        {/* Employees Tab Content */}
        {activeTab === "employees" && (
          <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-700">Employees</h2>
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
          </Card>
        )}

        {/* Reviews Tab Content */}
        {activeTab === "reviews" && (
          <Card className="p-8 rounded-2xl shadow-xl border-0 bg-white">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Reviews</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Review ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Employee</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Score</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{review.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{review.employeeName}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${review.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{review.score || 'N/A'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{review.date}</td>
                    </tr>
                  ))}
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