import { AlertCircle, Plus } from "lucide-react";
import { DeviceCarousel } from "./device-carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Device } from "@/actions/devices";
import { Link, useNavigate } from "@remix-run/react";
import { PaginatedResponse } from "@/lib/api-client";

interface DashboardProps {
  devices: PaginatedResponse<Device>;
}

export default function Dashboard({ devices }: DashboardProps) {
  const { results: deviceList } = devices;
  const navigate = useNavigate();
  const connectionIssues = deviceList.filter((device) => !device.is_active);
  const hasIssues = connectionIssues.length > 0;
  const hasDevices = deviceList.length > 0;

  const issueDetails = connectionIssues
    .map((device) => `${device.name}: Not connected`)
    .join("\n");

  const handleDeviceSelect = (device: Device) => {
    navigate(`/app/device/${device.uuid}`);
  };

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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Plants</h2>
          </div>
        </div>
        <div className="w-screen -mx-[calc((100vw-100%)/2)]">
          <div className="max-w-7xl mx-auto px-4">
            <DeviceCarousel
              devices={deviceList}
              onDeviceSelect={handleDeviceSelect}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
