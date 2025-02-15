import { create } from "zustand";
import { notifications as initialNotifications } from "@/lib/mocked-notifications";
import { PlantNotification } from "@/types/notification";

interface NotificationStore {
  notifications: PlantNotification[];
  clearNotification: (id: number) => void;
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: initialNotifications,
  clearNotification: (id: number) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAllNotifications: () => set({ notifications: [] }),
}));
