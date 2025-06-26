import { FileText, Clock, Users, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  type: 'evaluation_completed' | 'evaluation_started';
  text: string;
  timestamp: string;
}

interface ActivityCardProps {
  activity: Activity;
  index: number;
  totalActivities: number;
  onViewDetails?: (activityId: string) => void;
}

export default function ActivityCard({ 
  activity, 
  index, 
  totalActivities, 
  onViewDetails 
}: ActivityCardProps) {
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

  const getActivityIcon = () => {
    if (activity.type === 'evaluation_completed') {
      return <CheckCircle2 className="h-6 w-6 text-white" />;
    }
    return <PlayCircle className="h-6 w-6 text-white" />;
  };

  const getActivityColor = () => {
    if (activity.type === 'evaluation_completed') {
      return 'from-green-500 to-emerald-600';
    }
    return 'from-blue-500 to-indigo-600';
  };

  const getStatusColor = () => {
    if (activity.type === 'evaluation_completed') {
      return 'bg-green-500';
    }
    return 'bg-blue-500';
  };

  const getActivityTypeLabel = () => {
    if (activity.type === 'evaluation_completed') {
      return 'Evaluation Completed';
    }
    return 'Evaluation Started';
  };

  const getActivityTypeBadgeColor = () => {
    if (activity.type === 'evaluation_completed') {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="group relative">
      {/* Activity Card */}
      <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md">
        {/* Icon and Status */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getActivityColor()} flex items-center justify-center shadow-lg`}>
              {getActivityIcon()}
            </div>
            {/* Status indicator */}
            <div className={`absolute -top-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full border-2 border-white shadow-sm`}></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Main Activity Text */}
          <div className="mb-2">
            <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-relaxed">
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
              <div className={`w-2 h-2 ${getStatusColor()} rounded-full`}></div>
              <span className={`px-2 py-1 ${getActivityTypeBadgeColor()} rounded-full text-xs font-medium`}>
                {getActivityTypeLabel()}
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
              <span>•</span>
              <span>ID: {activity.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onViewDetails?.(activity.id)}
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Connection Line (except for last item) */}
      {index < totalActivities - 1 && index < 4 && (
        <div className="absolute left-6 top-16 w-0.5 h-4 bg-gradient-to-b from-blue-300 to-transparent"></div>
      )}
    </div>
  );
} 