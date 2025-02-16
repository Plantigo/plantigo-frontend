import { PlantNotification } from "@/types/notification";
import { NotificationCard } from "./notification-card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationListProps {
  notifications: PlantNotification[];
  onClearNotification: (id: number) => void;
  onClearAll: () => void;
}

export function NotificationList({
  notifications,
  onClearNotification,
  onClearAll,
}: NotificationListProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {notifications.length > 0 ? (
          <motion.div
            className="space-y-3"
            key="notifications"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={onClearAll}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClear={onClearNotification}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-8 text-muted-foreground"
          >
            No notifications to display
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
