export interface Device {
  id: string;
  name: string;
  batteryLevel: number;
  plantName: string;
  plantHealth: "good" | "medium" | "poor";
  moisture: number;
  temperature: number;
  lightLevel: number;
  isConnected: boolean;
}

export const devices: Device[] = [
  {
    id: "1",
    name: "Device 1",
    batteryLevel: 85,
    plantName: "Monstera",
    plantHealth: "good",
    moisture: 65,
    temperature: 22,
    lightLevel: 75,
    isConnected: true,
  },
  {
    id: "2",
    name: "Device 2",
    batteryLevel: 45,
    plantName: "Ficus",
    plantHealth: "medium",
    moisture: 40,
    temperature: 20,
    lightLevel: 60,
    isConnected: true,
  },
  {
    id: "3",
    name: "Device 3",
    batteryLevel: 20,
    plantName: "Cactus",
    plantHealth: "poor",
    moisture: 15,
    temperature: 25,
    lightLevel: 90,
    isConnected: true,
  },
  {
    id: "4",
    name: "Device 4",
    batteryLevel: 70,
    plantName: "Orchid",
    plantHealth: "good",
    moisture: 55,
    temperature: 21,
    lightLevel: 65,
    isConnected: true,
  },
  {
    id: "5",
    name: "Device 5",
    batteryLevel: 10,
    plantName: "Succulent",
    plantHealth: "poor",
    moisture: 5,
    temperature: 23,
    lightLevel: 85,
    isConnected: false,
  },
];

export const getBatteryColor = (level: number) => {
  if (level > 60) return "text-green-500";
  if (level > 20) return "text-yellow-500";
  return "text-red-500";
};
