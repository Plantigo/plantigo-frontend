import { AlertCircle, Droplet, Sun } from "lucide-react";
import { PlantNotificationType } from "@/types/plant-notification";
import { cn } from "@/lib/utils";

interface NotificationIconProps {
  type: PlantNotificationType;
  className?: string;
}

export function NotificationIcon({ type, className }: NotificationIconProps) {
  const iconProps = {
    className: cn("w-5 h-5", className),
  };

  switch (type) {
    case "water":
      return <Droplet {...iconProps} className={cn(iconProps.className, "text-blue-500")} />;
    case "sunlight":
      return <Sun {...iconProps} className={cn(iconProps.className, "text-yellow-500")} />;
    default:
      return <AlertCircle {...iconProps} className={cn(iconProps.className, "text-red-500")} />;
  }
}