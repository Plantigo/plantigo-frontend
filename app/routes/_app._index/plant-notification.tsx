import { AlertCircle, Droplet, Sun, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PlantNotification {
  id: number;
  message: string;
  type: "water" | "sunlight" | "general";
  timestamp: string;
}

const notifications: PlantNotification[] = [
  {
    id: 1,
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
  const getIcon = (type: PlantNotification["type"]) => {
    switch (type) {
      case "water":
        return <Droplet className="w-5 h-5 text-blue-500" />;
      case "sunlight":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id}>
          <CardContent className="flex items-center p-4">
            {getIcon(notification.type)}
            <div className="ml-4 flex-grow">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs text-gray-500">{notification.timestamp}</p>
            </div>
            <Clock className="w-4 h-4 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
