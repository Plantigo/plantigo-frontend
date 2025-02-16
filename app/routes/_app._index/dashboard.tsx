import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Plus } from "lucide-react";
import { DeviceCarousel } from "./device-carousel";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "./loading-overlay";
import { PlantDetails } from "./device-details";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Device } from "@/actions/devices";
import { useLoaderData, Link } from "@remix-run/react";
import { PaginatedResponse } from "@/lib/api-client";

export default function Dashboard() {
  const { results: devices } = useLoaderData<PaginatedResponse<Device>>();
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

  const connectionIssues = devices.filter((device) => !device.is_active);
  const hasIssues = connectionIssues.length > 0;
  const hasDevices = devices.length > 0;

  const issueDetails = connectionIssues
    .map((device) => `${device.name}: Not connected`)
    .join("\n");

  if (!hasDevices) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <h2 className="text-2xl font-semibold">Welcome to Plantigo!</h2>
        <p className="text-muted-foreground max-w-md">
          Connect your first device to start monitoring your plants.
        </p>
        <Button size="lg" asChild>
          <Link to="/setup-device" className="gap-2 text-lg">
            <Plus className="w-5 h-5" />
            Add Your First Device
          </Link>
        </Button>
      </div>
    );
  }

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
      <section className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Plants</h2>
        </div>
        <DeviceCarousel devices={devices} onDeviceSelect={handleDeviceSelect} />
      </section>

      <AnimatePresence mode="wait" initial={false}>
        {selectedDevice && (
          <motion.section
            key={selectedDevice.uuid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            layout
            className="w-full max-w-4xl mx-auto"
          >
            <PlantDetails device={selectedDevice} />
          </motion.section>
        )}
      </AnimatePresence>

      {isLoading && <LoadingOverlay message="Updating plant data..." />}
    </div>
  );
}
