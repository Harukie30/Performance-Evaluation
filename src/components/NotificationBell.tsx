import { useState, useEffect } from "react";
import { Bell, CheckCircle2, Clock, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp } from "@/lib/utils";

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

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationBell({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification["type"], large = false) => {
    switch (type) {
      case "evaluation_completed":
        return <CheckCircle2 className={large ? "h-7 w-7 text-green-600" : "h-4 w-4 text-green-600"} />;
      case "evaluation_started":
        return <FileText className={large ? "h-7 w-7 text-blue-600" : "h-4 w-4 text-blue-600"} />;
      case "reminder":
        return <Clock className={large ? "h-7 w-7 text-yellow-600" : "h-4 w-4 text-yellow-600"} />;
      default:
        return <Bell className={large ? "h-7 w-7 text-gray-600" : "h-4 w-4 text-gray-600"} />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "evaluation_completed":
        return "bg-green-50 border-green-200";
      case "evaluation_started":
        return "bg-blue-50 border-blue-200";
      case "reminder":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-4 bg-white rounded-full transition-all shadow-md hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-400"
        >
          <Bell className="h-8 w-8 text-blue-700" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-4 -right-3 h-7 w-7 rounded-full p-0 flex items-center bg-white justify-center font-bold text-red-500 text-lg animate-pulse shadow border-2 border-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-96 max-h-[32rem] overflow-y-auto bg-white border border-blue-100 shadow-2xl rounded-2xl p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="p-4 border-b border-blue-100 bg-blue-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-blue-700 text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-3 shadow">
                <Bell className="h-8 w-8 text-blue-300" />
              </div>
              <p className="font-semibold text-blue-700 mb-1">You're all caught up!</p>
              <p className="text-xs text-gray-400">No new notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-5 border-b border-blue-50 last:border-b-0 cursor-pointer flex gap-4 items-start transition-all duration-150 group relative ${
                  !notification.read ? "bg-blue-50" : "bg-white"
                } ${
                  notification.type === 'evaluation_completed' ? 'border-l-4 border-green-400' :
                  notification.type === 'evaluation_started' ? 'border-l-4 border-blue-400' :
                  notification.type === 'reminder' ? 'border-l-4 border-yellow-400' :
                  'border-l-4 border-gray-200'
                } hover:bg-blue-100`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full shadow ${
                    notification.type === 'evaluation_completed' ? 'bg-green-100' :
                    notification.type === 'evaluation_started' ? 'bg-blue-100' :
                    notification.type === 'reminder' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type, true)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${
                      !notification.read ? "text-blue-900" : "text-gray-700"
                    }`}>{notification.title}</p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-3 border-t border-blue-100 bg-blue-50 rounded-b-2xl">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-blue-600 hover:text-blue-800 font-semibold"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 