import { useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Device } from "@/actions/devices";
import { type PaginatedResponse, type Telemetry } from "@/actions/telemetry";
import MoistureDiagram from "./moisture-diagram";
import { useFetcher } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DeviceDetailsProps {
  device: Device;
  telemetry: PaginatedResponse<Telemetry>;
}

export function DeviceDetails({
  device,
  telemetry: initialTelemetry,
}: DeviceDetailsProps) {
  const fetcher = useFetcher<PaginatedResponse<Telemetry>>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const telemetry = fetcher.data ?? initialTelemetry;
  const latestTelemetry = telemetry.results[0];

  const convertToPercentage = (value: number) => {
    return Math.round((value / 1000) * 100);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetcher.submit({}, { method: "post" });
    // Reset the refreshing state after a delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold mb-2">{device.name}</h1>
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-background/50 w-fit">
          {device.is_active ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Disconnected</span>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Soil Moisture</CardTitle>
            <CardDescription>
              Current moisture level in the soil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoistureDiagram
              moisture={
                latestTelemetry
                  ? convertToPercentage(latestTelemetry.soil_moisture)
                  : 0
              }
              lastMeasuredAt={
                latestTelemetry
                  ? new Date(latestTelemetry.timestamp)
                  : new Date()
              }
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
