import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Clock, CheckCircle2, Search, Filter, Loader2 } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/lib/utils";
import Link from "next/link";

type ActivityType = "evaluation" | "update" | "completion";

interface RecentActivity {
  id: string;
  type: ActivityType;
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

interface RecentActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: RecentActivity[];
  isLoading?: boolean;
}

export default function RecentActivityModal({
  isOpen,
  onClose,
  activities,
  isLoading = false,
}: RecentActivityModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ActivityType | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "evaluation":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "update":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "completion":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "evaluation":
        return "bg-blue-100";
      case "update":
        return "bg-yellow-100";
      case "completion":
        return "bg-green-100";
    }
  };

  const getActivityTypeLabel = (type: ActivityType) => {
    switch (type) {
      case "evaluation":
        return "Evaluation";
      case "update":
        return "Update";
      case "completion":
        return "Completion";
    }
  };

  const filteredActivities = activities
    .filter((activity) => {
      const searchTermLower = searchTerm.toLowerCase();
      const descriptionLower = (activity.description || '').toLowerCase();
      const employeeNameLower = (activity.employeeName || '').toLowerCase();
      
      const matchesSearch = 
        descriptionLower.includes(searchTermLower) ||
        employeeNameLower.includes(searchTermLower);
      
      const matchesFilter = 
        filterType === "all" || activity.type === filterType;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      try {
        const dateA = new Date(a.timestamp || '').getTime();
        const dateB = new Date(b.timestamp || '').getTime();
        
        if (isNaN(dateA) || isNaN(dateB)) {
          console.warn("Invalid date found during sorting:", { a: a.timestamp, b: b.timestamp });
          return 0;
        }
        
        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
      } catch (error) {
        console.error("Error sorting activities:", error);
        return 0;
      }
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Recent Activity</DialogTitle>
        </DialogHeader>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-4">
            <Select 
              value={filterType} 
              onValueChange={(value: ActivityType | "all") => setFilterType(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="evaluation">Evaluations</SelectItem>
                <SelectItem value="update">Updates</SelectItem>
                <SelectItem value="completion">Completions</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={sortBy} 
              onValueChange={(value: "newest" | "oldest") => setSortBy(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading activities...</span>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activities found matching your criteria
            </div>
          ) : (
            filteredActivities.map((activity) => (
              activity.reviewId ? (
                <Link
                  href={`/performance/${activity.reviewId}`}
                  key={activity.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{activity.description}</p>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">{getActivityTypeLabel(activity.type)}</span>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{formatTimestamp(activity.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm text-gray-600"><span className="font-medium">Employee:</span> {activity.employeeName}</p>
                      {activity.department && activity.department !== "General" && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Dept:</span> {activity.department}</p>
                      )}
                      {activity.reviewPeriod && activity.reviewPeriod !== "Current Period" && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Period:</span> {activity.reviewPeriod}</p>
                      )}
                      {activity.score && activity.score > 0 && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Score:</span> {activity.score}</p>
                      )}
                    </div>
                    <p className="text-xs text-blue-500 mt-1">Click to view evaluation details</p>
                  </div>
                </Link>
              ) : (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{activity.description}</p>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">{getActivityTypeLabel(activity.type)}</span>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{formatTimestamp(activity.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm text-gray-600"><span className="font-medium">Employee:</span> {activity.employeeName}</p>
                      {activity.department && activity.department !== "General" && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Dept:</span> {activity.department}</p>
                      )}
                      {activity.reviewPeriod && activity.reviewPeriod !== "Current Period" && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Period:</span> {activity.reviewPeriod}</p>
                      )}
                      {activity.score && activity.score > 0 && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Score:</span> {activity.score}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredActivities.length} of {activities.length} activities
            </p>
            <Button 
              className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black" 
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 