import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Device } from "@/actions/devices";

interface PlantDetailsProps {
  device: Device;
}

export function PlantDetails({ device }: PlantDetailsProps) {
  const [activeTab, setActiveTab] = useState("status");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{device.name} Details</CardTitle>
        <CardDescription>Monitor your device's status</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full h-16 grid-cols-2 mb-8">
            <TabsTrigger value="status" className="flex flex-col items-center">
              <Wifi
                className={cn(
                  "h-5 w-5 mb-1",
                  device.is_active ? "text-green-500" : "text-gray-400"
                )}
              />
              Status
            </TabsTrigger>
            <TabsTrigger value="info" className="flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Device Info</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div>
                <h3 className="font-medium">Connection Status</h3>
                <p className="text-sm text-muted-foreground">
                  {device.is_active ? "Connected" : "Disconnected"}
                </p>
              </div>
              {device.is_active ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
              <div>
                <h3 className="font-medium">MAC Address</h3>
                <p className="text-sm text-muted-foreground">
                  {device.mac_address}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
