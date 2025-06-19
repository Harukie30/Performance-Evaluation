"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, CheckCircle2, Clock, FileText, User, ChevronRight, Star, Search, MoreHorizontal, TrendingUp, Activity, Calendar, Award } from "lucide-react";

// Mock user and evaluation data for demonstration
const mockUser = {
  id: "emp001",
  name: "Jane Employee",
  role: "employee",
  department: "Sales",
};

const mockEvaluations = [
  {
    id: "eval1",
    reviewPeriod: "Q1 2024",
    status: "completed",
    score: 88,
    lastModified: "2024-04-10",
    comments: "Great performance in Q1!",
    manager: "Sarah Johnson",
  },
  {
    id: "eval2",
    reviewPeriod: "Q2 2024",
    status: "pending",
    score: null,
    lastModified: "2024-06-01",
    comments: "",
    manager: "Michael Chen",
  },
  {
    id: "eval3",
    reviewPeriod: "Q4 2023",
    status: "completed",
    score: 92,
    lastModified: "2023-12-15",
    comments: "Exceptional performance in Q4",
    manager: "Robert Davis",
  },
];

export default function EmployeeDashboard() {
  const [user, setUser] = useState(mockUser);
  const [evaluations, setEvaluations] = useState(mockEvaluations);
  const [activeTab, setActiveTab] = useState("evaluations");
  const [statsVisible, setStatsVisible] = useState(false);

  // Stats calculation
  const totalEvaluations = evaluations.length;
  const completedEvaluations = evaluations.filter(e => e.status === "completed").length;
  const pendingEvaluations = evaluations.filter(e => e.status !== "completed").length;
  const averageScore =
    completedEvaluations > 0
      ? (
          evaluations
            .filter(e => e.status === "completed" && typeof e.score === "number")
            .reduce((sum, e) => sum + (e.score || 0), 0) / completedEvaluations
        ).toFixed(1)
      : "N/A";
  
  // Calculate performance trend
  const completedEvals = evaluations.filter(e => e.status === "completed");
  const performanceTrend = completedEvals.length > 1 
    ? ((completedEvals[0].score! - completedEvals[1].score!) / completedEvals[1].score! * 100).toFixed(1)
    : "N/A";
  
  const performanceDirection = performanceTrend === "N/A" 
    ? "flat" 
    : parseFloat(performanceTrend) > 0 ? "up" : "down";

  useEffect(() => {
    // Animation trigger
    const timer = setTimeout(() => {
      setStatsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Total Evaluations",
      value: totalEvaluations,
      icon: <FileText className="h-5 w-5" />,
      color: "bg-blue-500/10 text-blue-600",
      description: "All your performance reviews",
      trend: null,
    },
    {
      title: "Completed",
      value: completedEvaluations,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "bg-green-500/10 text-green-600",
      description: "Reviews you have finished",
      trend: null,
    },
    {
      title: "Pending",
      value: pendingEvaluations,
      icon: <Clock className="h-5 w-5" />,
      color: "bg-yellow-500/10 text-yellow-600",
      description: "Upcoming or in-progress reviews",
      trend: null,
    },
    {
      title: "Performance",
      value: averageScore,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-purple-500/10 text-purple-600",
      description: "Your average score",
      trend: performanceDirection === "up" ? `+${performanceTrend}%` : performanceDirection === "down" ? `${performanceTrend}%` : "N/A",
    },
  ];

  // Render a progress bar for scores
  const renderScoreBar = (score: number | null) => {
    if (score === null) return <div className="h-2 bg-gray-100 rounded-full w-full"></div>;
    
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <span className="text-sm font-medium w-10">{score}%</span>
      </div>
    );
  };

  // Render status badge with animation
  const renderStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <motion.span 
          className="px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle2 size={12} /> Completed
        </motion.span>
      );
    }
    
    return (
      <motion.span 
        className="px-2.5 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 flex items-center gap-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Clock size={12} /> Pending
      </motion.span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 font-sans">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
            <p className="text-gray-500">Track and improve your performance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none shadow-xl rounded-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-blue-100 mb-4 max-w-2xl">
                  You have {pendingEvaluations} pending evaluation{pendingEvaluations !== 1 ? 's' : ''}. 
                  Your current performance score is {averageScore}%.
                </p>
                <div className="flex gap-3">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                    <Calendar size={16} /> Schedule Review
                  </Button>
                  <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                    View Goals
                  </Button>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Current Rank</p>
                  <p className="text-xl font-bold">#2 in Sales</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab("evaluations")}
            className={`px-4 py-3 font-medium text-sm relative ${activeTab === "evaluations" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Evaluations
            {activeTab === "evaluations" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                layoutId="tabIndicator"
              />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-3 font-medium text-sm relative ${activeTab === "performance" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Performance
            {activeTab === "performance" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                layoutId="tabIndicator"
              />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("goals")}
            className={`px-4 py-3 font-medium text-sm relative ${activeTab === "goals" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Goals
            {activeTab === "goals" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                layoutId="tabIndicator"
              />
            )}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={statsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>{stat.icon}</div>
                  {stat.trend && (
                    <span className={`px-2 py-1 rounded-full text-xs ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <Card className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Performance Trend</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Quarterly</Button>
                <Button variant="outline" size="sm">Yearly</Button>
              </div>
            </div>
            <div className="flex items-end h-48 gap-4 border-b border-gray-100 pb-4">
              {completedEvals.map((evalItem, index) => (
                <div key={evalItem.id} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">{evalItem.reviewPeriod}</div>
                  <motion.div 
                    className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-lg max-w-[60px]"
                    initial={{ height: 0 }}
                    animate={{ height: `${evalItem.score! * 0.8}%` }}
                    transition={{ duration: 1, delay: 0.2 * index }}
                  />
                  <div className="text-sm font-medium mt-2">{evalItem.score}%</div>
                </div>
              ))}
              <div className="flex-1 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-2">Q2 2024</div>
                <div className="w-full bg-gray-200 rounded-t-lg max-w-[60px] h-16"></div>
                <div className="text-sm font-medium mt-2 text-gray-400">-</div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Performance Trend</p>
                <div className="flex items-center gap-1 mt-1">
                  {performanceDirection === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : performanceDirection === "down" ? (
                    <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                  ) : (
                    <Activity className="h-4 w-4 text-gray-500" />
                  )}
                  <span className={`font-medium ${performanceDirection === "up" ? "text-green-600" : performanceDirection === "down" ? "text-red-600" : "text-gray-600"}`}>
                    {performanceTrend === "N/A" ? "No trend data" : `${performanceTrend}%`}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                View Full Report <ChevronRight size={16} />
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Skill Assessment</h2>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            <div className="space-y-6">
              {[
                { skill: "Communication", score: 92, trend: "up" },
                { skill: "Problem Solving", score: 85, trend: "up" },
                { skill: "Team Collaboration", score: 88, trend: "stable" },
                { skill: "Technical Knowledge", score: 78, trend: "down" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                    <span className="text-sm font-medium text-gray-900">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${item.score > 85 ? "bg-green-500" : item.score > 75 ? "bg-blue-500" : "bg-yellow-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: 0.1 * index }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-xs text-gray-500">
                      {item.trend === "up" ? "Improved" : item.trend === "down" ? "Needs attention" : "Stable"}
                    </span>
                    <span className={`text-xs ${item.trend === "up" ? "text-green-600" : item.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                      {item.trend === "up" ? "+4%" : item.trend === "down" ? "-3%" : "0%"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Evaluations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Evaluations</h2>
              <Button variant="outline" className="flex items-center gap-2">
                View All <ChevronRight size={16} />
              </Button>
            </div>
            <div className="border-t border-gray-100">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Review Period</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Manager</TableHead>
                    <TableHead className="font-semibold">Score</TableHead>
                    <TableHead className="font-semibold">Last Modified</TableHead>
                    <TableHead className="font-semibold">Comments</TableHead>
                    <TableHead className="font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evalItem, index) => (
                    <TableRow key={evalItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="font-medium">{evalItem.reviewPeriod}</TableCell>
                      <TableCell>{renderStatusBadge(evalItem.status)}</TableCell>
                      <TableCell>{evalItem.manager}</TableCell>
                      <TableCell>
                        {renderScoreBar(evalItem.score)}
                      </TableCell>
                      <TableCell>{evalItem.lastModified}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{evalItem.comments || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>

        {/* Improvement Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500/10 p-3 rounded-lg">
                <LightBulb className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Improvement Opportunities</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Focus on technical knowledge development - aim for 85% proficiency</li>
                  <li>Enhance cross-department collaboration skills</li>
                  <li>Improve documentation of sales processes</li>
                  <li>Attend advanced negotiation training</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/10 p-3 rounded-lg">
                <Star className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Recent Achievements</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Exceeded Q1 sales target by 23%</li>
                  <li>Recognized as top performer in Q4 2023</li>
                  <li>Implemented new CRM workflow adopted by entire team</li>
                  <li>Received 98% positive feedback from key accounts</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Helper components
function LightBulb(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}