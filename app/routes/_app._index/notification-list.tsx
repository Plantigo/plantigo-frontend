import { PlantNotification } from "@/types/plant-notification";
import { NotificationCard } from "./notification-card";

interface NotificationListProps {
  notifications: PlantNotification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
}