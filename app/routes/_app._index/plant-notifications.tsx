import { notifications } from "@/lib/mocked-notifications";
import { NotificationList } from "./notification-list";

export function PlantNotifications() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Plant Notifications</h2>
        <span className="text-sm text-muted-foreground">
          {notifications.length} notifications
        </span>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  );
}
