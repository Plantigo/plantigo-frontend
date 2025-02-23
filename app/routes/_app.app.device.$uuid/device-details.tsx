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
import { AlertCircle } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            {latestTelemetry ? (
              <MoistureDiagram
                moisture={convertToPercentage(latestTelemetry.soil_moisture)}
                lastMeasuredAt={new Date(latestTelemetry.timestamp)}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Data Available
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  There is no moisture data available for this device yet.
                </p>
                <Button
                  onClick={handleRefresh}
                  variant="secondary"
                  size="lg"
                  className="text-sm flex items-center gap-2"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={cn("h-4 w-4", {
                      "animate-spin": isRefreshing,
                    })}
                  />
                  Refresh Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
