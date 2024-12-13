import { PlantNotification } from "@/types/notification";

export const notifications: PlantNotification[] = [
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
