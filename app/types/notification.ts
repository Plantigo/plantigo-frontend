export type PlantNotificationType = "water" | "sunlight" | "general";

export interface PlantNotification {
  id: number;
  message: string;
  type: PlantNotificationType;
  timestamp: string;
}
