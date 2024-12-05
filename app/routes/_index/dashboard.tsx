import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Battery, Terminal, WifiOff } from "lucide-react";
import { Device, DeviceCarousel } from "./device-carousel";
import { Button } from "~/components/ui/button";
import { PlantNotifications } from "./plant-notification";
import MoistureDiagram from "./moisture-diagram";
import { useToast } from "~/hooks/use-toast";
import { LoadingOverlay } from "./loading-overlay";
import { PlantDetails } from "./device-details";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

const devices: Device[] = [
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

export default function Dashboard() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDeviceSelect = useCallback((device: Device) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedDevice(device);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data refreshed",
        description: "Your plant data has been updated.",
      });
    }, 1000);
  }, [toast]);

  const mockFetchDevices = (): Promise<Device[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(devices);
      }, 500);
    });
  };

  const connectionIssues = devices.filter((device) => !device.isConnected);
  const lowBatteryDevices = devices.filter(
    (device) => device.batteryLevel < 25
  );
  const hasIssues = connectionIssues.length > 0 || lowBatteryDevices.length > 0;

  const issueDetails = [
    ...connectionIssues.map((device) => `${device.name}: Not connected`),
    ...lowBatteryDevices.map(
      (device) => `${device.name}: Low battery (${device.batteryLevel}%)`
    ),
  ].join("\n");

  return (
    <div className="flex flex-col gap-8">
      {hasIssues && (
        <Alert variant="destructive">
          <AlertTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Attention Required
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="whitespace-pre-wrap">{issueDetails}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </AlertTitle>
          <AlertDescription>
            There are issues with some devices. Please verify their status.
          </AlertDescription>
        </Alert>
      )}
      <section className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Plants</h2>
          {/* <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </Button> */}
        </div>
        <DeviceCarousel
          devices={devices}
          onDeviceSelect={handleDeviceSelect}
          fetchDevices={mockFetchDevices}
        />
      </section>

      <AnimatePresence mode="wait">
        {selectedDevice && (
          <motion.section
            key={selectedDevice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto"
          >
            <PlantDetails device={selectedDevice} />
          </motion.section>
        )}
      </AnimatePresence>

      <section className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Plant Notifications</h2>
        <PlantNotifications />
      </section>

      {isLoading && <LoadingOverlay message="Updating plant data..." />}
    </div>
  );
}
