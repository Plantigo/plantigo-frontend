import { Clock, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlantNotification } from "@/types/notification";
import { NotificationIcon } from "./notification-icon";
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NotificationCardProps {
  notification: PlantNotification;
  onClear: (id: number) => void;
  className?: string;
}

export function NotificationCard({
  notification,
  onClear,
  className,
}: NotificationCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 100], [1, 0.3]);
  const scale = useTransform(x, [0, 100], [1, 0.9]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      setIsVisible(false);
      setTimeout(() => onClear(notification.id), 200);
    }
  };

  const handleClear = () => {
    setIsVisible(false);
    setTimeout(() => onClear(notification.id), 200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, height: "auto", marginTop: 12 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            style={{ x, opacity, scale }}
            drag="x"
            dragConstraints={{ left: 0, right: 100 }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: "grabbing" }}
            className="touch-pan-y"
          >
            <Card
              className={cn(
                "group hover:shadow-md transition-all duration-300",
                className
              )}
            >
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
                <div className="flex items-center gap-2 shrink-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
