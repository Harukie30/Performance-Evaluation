import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface RecentActivity {
  id: string;
  type: "evaluation" | "update" | "completion";
  description: string;
  timestamp: string;
  employeeName: string;
}

interface RecentActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: RecentActivity[];
}

export default function RecentActivityModal({
  isOpen,
  onClose,
  activities,
}: RecentActivityModalProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "evaluation":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "update":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "completion":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "evaluation":
        return "bg-blue-100";
      case "update":
        return "bg-yellow-100";
      case "completion":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Recent Activity</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{activity.description}</p>
                  <span className="text-sm text-gray-500">
                    {format(new Date(activity.timestamp), "MMM d, yyyy h:mm a")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.employeeName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 