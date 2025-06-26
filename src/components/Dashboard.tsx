"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { reviewAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DashboardStats {
  totalReviews: number;
  pendingReviews: number;
  completedReviews: number;
  averageScore: number;
}

interface RecentActivity {
  id: string;
  employeeName: string;
  type: string;
  status: string;
  date: string;
}

interface Review {
  id: string;
  status: string;
  finalScore?: number;
  reviewType?: string;
  createdAt: string;
  employee?: {
    name: string;
  };
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReviews: 0,
    pendingReviews: 0,
    completedReviews: 0,
    averageScore: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [reviewsResponse] = await Promise.all([
        reviewAPI.getAll(),
      ]);

      const reviews = reviewsResponse.data as Review[];
      
      // Calculate stats
      const totalReviews = reviews.length;
      const pendingReviews = reviews.filter((r: Review) => r.status === "Pending").length;
      const completedReviews = reviews.filter((r: Review) => r.status === "Completed").length;
      const averageScore = reviews.reduce((acc: number, review: Review) => acc + (review.finalScore || 0), 0) / totalReviews || 0;

      setStats({
        totalReviews,
        pendingReviews,
        completedReviews,
        averageScore,
      });

      // Get recent activities
      const activities = reviews
        .sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((review: Review) => ({
          id: review.id,
          employeeName: review.employee?.name || "Unknown",
          type: review.reviewType || "Performance Review",
          status: review.status,
          date: new Date(review.createdAt).toLocaleDateString(),
        }));

      setRecentActivities(activities);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const statCards = [
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Completed Reviews",
      value: stats.completedReviews,
      icon: <CheckCircle2 className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Average Score",
      value: stats.averageScore.toFixed(1),
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium text-gray-900">{error}</p>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No recent activities
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{activity.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{activity.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/employees">
                  <Users className="mr-2 h-4 w-4" />
                  View All Employees
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/reviews/new">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Start New Review
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/reviews/completed">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  View Completed Reviews
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 