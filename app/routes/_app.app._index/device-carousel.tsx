import {
  CircuitBoard,
  Wifi,
  WifiOff,
  ChevronRight,
  Sprout,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Device } from "@/actions/devices";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface DeviceCarouselProps {
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
}

const CARD_WIDTH = 300;
const CARD_GAP = 24;

export function DeviceCarousel({
  devices,
  onDeviceSelect,
}: DeviceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const getVisibleCards = () => {
    const start = currentIndex;
    const end = Math.min(currentIndex + 3, devices.length);
    return devices.slice(start, end);
  };

  const slideLeft = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const slideRight = () => {
    if (currentIndex < devices.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!isDesktop) {
    return (
      <div className="relative px-4">
        <div className="flex justify-center">
          <div
            key={currentIndex}
            className={cn(
              "w-full max-w-[300px] transition-all duration-200",
              direction > 0 ? "animate-slideFromRight" : "animate-slideFromLeft"
            )}
          >
            <Card
              className={cn(
                "overflow-hidden border-0 shadow-none h-full",
                "hover:shadow-lg hover:shadow-primary/5"
              )}
            >
              <CardContent
                className={cn(
                  "p-6 md:p-8 cursor-pointer rounded-xl h-full",
                  "group relative flex flex-col"
                )}
                style={{
                  backgroundImage: `url('/plant-bg${
                    currentIndex % 2 === 0 ? "4" : "6"
                  }.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-background/90" />
                <div className="relative flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center gap-3">
                        <div className="w-32 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold">
                          {devices[currentIndex].name}
                        </div>
                        {devices[currentIndex].is_active ? (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                            <Wifi className="w-4 h-4" />
                            <span className="text-xs font-medium">Online</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500">
                            <WifiOff className="w-4 h-4" />
                            <span className="text-xs font-medium">Offline</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5 w-40">
                        <Sprout className="w-6 h-6 text-primary" />
                        {devices[currentIndex].plant_name ? (
                          devices[currentIndex].plant_name
                        ) : (
                          <span className="italic">Plant name not set</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <CircuitBoard className="w-5 h-5 text-primary" />
                        <span className="font-mono text-xs">
                          {devices[currentIndex].mac_address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end text-sm text-muted-foreground group-hover:text-primary transition-colors mt-6">
                    <Button
                      variant="link"
                      onClick={() => onDeviceSelect(devices[currentIndex])}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={slideLeft}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={slideRight}
            disabled={currentIndex === devices.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-6 justify-center transition-all duration-200">
        {getVisibleCards().map((device, index) => (
          <div
            key={device.uuid}
            className={cn(
              "w-[300px] transition-all duration-200",
              direction > 0
                ? "animate-slideFromRight"
                : "animate-slideFromLeft",
              `animation-delay-${index * 100}`
            )}
          >
            <Card
              className={cn(
                "overflow-hidden border-0 shadow-none h-full",
                "hover:shadow-lg hover:shadow-primary/5"
              )}
            >
              <CardContent
                className={cn(
                  "p-6 md:p-8 cursor-pointer rounded-xl h-full",
                  "group relative flex flex-col"
                )}
                style={{
                  backgroundImage: `url('/plant-bg${
                    index % 2 === 0 ? "4" : "6"
                  }.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-background/90" />
                <div className="relative flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center gap-3">
                        <div className="w-32 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold">
                          {device.name}
                        </div>
                        {device.is_active ? (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                            <Wifi className="w-4 h-4" />
                            <span className="text-xs font-medium">Online</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500">
                            <WifiOff className="w-4 h-4" />
                            <span className="text-xs font-medium">Offline</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5 w-40">
                        <Sprout className="w-6 h-6 text-primary" />
                        {device.plant_name ? (
                          device.plant_name
                        ) : (
                          <span className="italic">Plant name not set</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <CircuitBoard className="w-5 h-5 text-primary" />
                        <span className="font-mono text-xs">
                          {device.mac_address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end text-sm text-muted-foreground group-hover:text-primary transition-colors mt-6">
                    <Button
                      variant="link"
                      onClick={() => onDeviceSelect(device)}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute -left-12 top-1/2 -translate-y-1/2 hidden md:flex bg-background/50 backdrop-blur-sm border-muted/20 hover:bg-background/80"
        onClick={slideLeft}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:flex bg-background/50 backdrop-blur-sm border-muted/20 hover:bg-background/80"
        onClick={slideRight}
        disabled={currentIndex + 3 >= devices.length}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
