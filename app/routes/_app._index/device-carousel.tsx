import React, { useEffect, useState } from "react";
import { Battery, Leaf, Wifi, WifiOff, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Device, getBatteryColor } from "@/lib/mocked-devices";
import { cn } from "@/lib/utils";

interface DeviceCarouselProps {
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
  fetchDevices: () => Promise<Device[]>;
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
        return "text-emerald-500";
      case "medium":
        return "text-amber-500";
      case "poor":
        return "text-rose-500";
    }
  };

  return (
    <div className="relative px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Connected Devices
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm text-muted-foreground">
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : "Updating..."}
          </span>
        </div>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="overflow-hidden border-0 shadow-none">
                      <CardContent className="p-8 bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-xl border border-muted/20 rounded-xl">
                        <div className="space-y-4 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-4 bg-muted rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            : devices.map((device, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card
                      className={cn(
                        "overflow-hidden border-0 shadow-none transition-all duration-500",
                        "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5"
                      )}
                    >
                      <CardContent
                        onClick={() => onDeviceSelect(device)}
                        className={cn(
                          "p-8 cursor-pointer rounded-xl",
                          "bg-gradient-to-br from-background/50 to-muted/30",
                          "backdrop-blur-xl border border-muted/20",
                          "group relative"
                        )}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

                        <div className="relative space-y-6">
                          <div className="flex justify-between items-center">
                            <div className="space-y-1">
                              <div className="text-lg font-semibold">
                                {device.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {device.id.slice(0, 8)}...
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {device.isConnected ? (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                  <Wifi className="w-4 h-4" />
                                  <span className="text-xs font-medium">
                                    Online
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500">
                                  <WifiOff className="w-4 h-4" />
                                  <span className="text-xs font-medium">
                                    Offline
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                              <Battery
                                className={cn(
                                  "w-5 h-5",
                                  getBatteryColor(device.batteryLevel)
                                )}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  Battery
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {device.batteryLevel}% remaining
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                              <Leaf
                                className={cn(
                                  "w-5 h-5",
                                  getPlantHealthColor(device.plantHealth)
                                )}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {device.plantName}
                                </div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  {device.plantHealth} health status
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end text-sm text-muted-foreground group-hover:text-primary transition-colors">
                            <span>View details</span>
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 bg-background/50 backdrop-blur-sm border-muted/20 hover:bg-background/80" />
        <CarouselNext className="hidden md:flex -right-12 bg-background/50 backdrop-blur-sm border-muted/20 hover:bg-background/80" />
      </Carousel>
    </div>
  );
}
