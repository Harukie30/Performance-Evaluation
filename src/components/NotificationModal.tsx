import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

export default function NotificationModal({ isOpen, onClose, notifications, onMarkAllAsRead }: NotificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">All Notifications</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No notifications</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg border ${notif.read ? "bg-gray-100" : "bg-yellow-50 border-yellow-300"}`}
              >
                <div className="font-semibold">{notif.title}</div>
                <div className="text-sm text-gray-600">{notif.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onMarkAllAsRead} variant="secondary">
            Mark all as read
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 