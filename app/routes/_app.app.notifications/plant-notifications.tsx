import { NotificationList } from "./notification-list";
import { useNotificationStore } from "@/stores/notification.store";

export function PlantNotifications() {
  const { notifications, clearNotification, clearAllNotifications } =
    useNotificationStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Plant Notifications</h2>
        <span className="text-sm text-muted-foreground">
          {notifications.length} notifications
        </span>
      </div>
      <NotificationList
        notifications={notifications}
        onClearNotification={clearNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
}
