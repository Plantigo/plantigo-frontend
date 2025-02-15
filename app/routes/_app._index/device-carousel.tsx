import React from "react";
import { Battery, Leaf, Wifi, WifiOff, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Device } from "@/actions/devices";

interface DeviceCarouselProps {
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
}

export function DeviceCarousel({
  devices,
  onDeviceSelect,
}: DeviceCarouselProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-auto max-w-[800px]">
        <Carousel className="relative mx-auto">
          <CarouselContent className="-ml-4">
            {devices.map((device) => (
              <CarouselItem
                key={device.uuid}
                className="pl-4 first:pl-4 last:pr-4 lg:basis-1/2 max-w-[420px]"
              >
                <div className="p-1 md:p-2 h-full">
                  <Card
                    className={cn(
                      "overflow-hidden border-0 shadow-none transition-all duration-500 h-full",
                      "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5"
                    )}
                  >
                    <CardContent
                      onClick={() => onDeviceSelect(device)}
                      className={cn(
                        "p-6 md:p-8 cursor-pointer rounded-xl h-full",
                        "bg-gradient-to-br from-background/50 to-muted/30",
                        "backdrop-blur-xl border border-muted/20",
                        "group relative flex flex-col"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

                      <div className="relative flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-lg font-semibold">
                              {device.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              MAC: {device.mac_address}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {device.is_active ? (
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

                        <div className="flex items-center justify-end text-sm text-muted-foreground group-hover:text-primary transition-colors mt-6">
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
    </div>
  );
}
