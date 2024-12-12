import React, { useEffect, useState } from "react";
import { Battery, Leaf, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Device, getBatteryColor } from "@/lib/mocked-devices";

interface DeviceCarouselProps {
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
  fetchDevices: () => Promise<Device[]>; // Funkcja do pobierania danych
}

export function DeviceCarousel({
  devices: initialDevices,
  onDeviceSelect,
  fetchDevices,
}: DeviceCarouselProps) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshDevices = async () => {
    setIsLoading(true);
    try {
      const updatedDevices = await fetchDevices();
      setDevices(updatedDevices);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing devices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPlantHealthColor = (health: Device["plantHealth"]) => {
    switch (health) {
      case "good":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "poor":
        return "text-red-500";
    }
  };

  return (
    <div className="relative">
      <div className="text-right text-sm text-gray-500 mb-4">
        {lastUpdated
          ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
          : "Loading..."}
      </div>

      <Carousel>
        <CarouselContent>
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 p-1"
                >
                  <Card>
                    <CardContent className="flex flex-col gap-4 p-6">
                      <Skeleton className="h-6 w-3/3" />
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-6 w-3/3" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            : devices.map((device) => (
                <CarouselItem
                  key={device.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent
                        className="flex flex-col gap-4 p-6 cursor-pointer"
                        onClick={() => onDeviceSelect(device)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-semibold">
                            {device.name}
                          </div>
                          {device.isConnected ? (
                            <Wifi className="w-6 h-6 text-green-500" />
                          ) : (
                            <WifiOff className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery
                            className={`w-6 h-6 ${getBatteryColor(
                              device.batteryLevel
                            )}`}
                          />
                          <span>{device.batteryLevel}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Leaf
                            className={`w-6 h-6 ${getPlantHealthColor(
                              device.plantHealth
                            )}`}
                          />
                          <span>{device.plantName}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
