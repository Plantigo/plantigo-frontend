import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { DeviceCarousel } from "./device-carousel";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "./loading-overlay";
import { PlantDetails } from "./device-details";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Device } from "@/actions/devices";
import { useLoaderData } from "@remix-run/react";
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

  const issueDetails = connectionIssues
    .map((device) => `${device.name}: Not connected`)
    .join("\n");

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

      <AnimatePresence mode="wait">
        {selectedDevice && (
          <motion.section
            key={selectedDevice.uuid}
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

      {isLoading && <LoadingOverlay message="Updating plant data..." />}
    </div>
  );
}
