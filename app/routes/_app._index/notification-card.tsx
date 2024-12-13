import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PlantNotification } from "@/types/plant-notification";
import { NotificationIcon } from "./notification-icon";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: PlantNotification;
  className?: string;
}

export function NotificationCard({ notification, className }: NotificationCardProps) {
  return (
    <Card className={cn("group hover:shadow-md transition-all duration-300", className)}>
      <CardContent className="flex items-center p-4 gap-4">
        <div className="shrink-0">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground">
            {notification.timestamp}
          </p>
        </div>
        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
      </CardContent>
    </Card>
  );
}