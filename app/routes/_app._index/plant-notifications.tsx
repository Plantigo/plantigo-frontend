import { NotificationList } from "./notification-list";
export type PlantNotificationType = "water" | "sunlight" | "general";

export interface PlantNotification {
  id: number;
  message: string;
  type: PlantNotificationType;
  timestamp: string;
}
export const notifications: PlantNotification[] = [
  {
    id: '1',
    message: "Water plant #1 at 2:00 PM",
    type: "water",
    timestamp: "Today",
  },
  {
    id: 4,
    message: "Plant #4 received little sunlight for 3 days",
    type: "sunlight",
    timestamp: "Last 3 days",
  },
  {
    id: 5,
    message: "Plant #5 hasn't been watered for 2 days",
    type: "water",
    timestamp: "Last 2 days",
  },
];
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
