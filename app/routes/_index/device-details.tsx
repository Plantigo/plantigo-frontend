import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Battery, Leaf, Thermometer, Sun, Droplets } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "~/lib/utils";
import MoistureDiagram from "./moisture-diagram";

interface PlantDetailsProps {
  device: {
    plantName: string;
    moisture: number;
    batteryLevel: number;
    plantHealth: string;
    temperature?: number;
    lightLevel?: number;
  };
}

// Mock data for charts
const mockData = [
  { time: "00:00", moisture: 60, battery: 100, temperature: 22, light: 0 },
  { time: "04:00", moisture: 58, battery: 95, temperature: 21, light: 0 },
  { time: "08:00", moisture: 55, battery: 90, temperature: 23, light: 50 },
  { time: "12:00", moisture: 50, battery: 85, temperature: 25, light: 100 },
  { time: "16:00", moisture: 48, battery: 80, temperature: 24, light: 80 },
  { time: "20:00", moisture: 52, battery: 75, temperature: 23, light: 20 },
];

export function PlantDetails({ device }: PlantDetailsProps) {
  const [activeTab, setActiveTab] = useState("moisture");

  const getStatusColor = (
    value: number,
    type: "moisture" | "battery" | "health"
  ) => {
    if (type === "moisture") {
      return value > 60
        ? "text-green-500"
        : value > 30
        ? "text-yellow-500"
        : "text-red-500";
    } else if (type === "battery") {
      return value > 50
        ? "text-green-500"
        : value > 20
        ? "text-yellow-500"
        : "text-red-500";
    } else {
      return device.plantHealth === "good"
        ? "text-green-500"
        : device.plantHealth === "medium"
        ? "text-yellow-500"
        : "text-red-500";
    }
  };

  const renderChart = (dataKey: string, color: string) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{device.plantName} Details</CardTitle>
        <CardDescription>Monitor your plant's vital signs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full h-16 grid-cols-4 mb-8">
            <TabsTrigger
              value="moisture"
              className="flex flex-col items-center"
            >
              <Droplets
                className={cn(
                  "h-5 w-5 mb-1",
                  getStatusColor(device.moisture, "moisture")
                )}
              />
              Moisture
            </TabsTrigger>
            <TabsTrigger value="battery" className="flex flex-col items-center">
              <Battery
                className={cn(
                  "h-5 w-5 mb-1",
                  getStatusColor(device.batteryLevel, "battery")
                )}
              />
              Battery
            </TabsTrigger>
            <TabsTrigger value="health" className="flex flex-col items-center">
              <Leaf
                className={cn("h-5 w-5 mb-1", getStatusColor(0, "health"))}
              />
              Health
            </TabsTrigger>
            <TabsTrigger
              value="environment"
              className="flex flex-col items-center"
            >
              <Sun className="h-5 w-5 mb-1 text-yellow-500" />
              Environment
            </TabsTrigger>
          </TabsList>
          <TabsContent value="moisture">
            <MoistureDiagram moisture={device.moisture} />

            <button
              className="px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100 transition duration-200"
              onClick={toggleDetails}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            {showDetails && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">Moisture Level</span>
                  <span
                    className={cn(
                      "text-3xl font-bold",
                      getStatusColor(device.moisture, "moisture")
                    )}
                  >
                    {device.moisture}%
                  </span>
                </div>
                {renderChart("moisture", "#3b82f6")}
              </div>
            )}
          </TabsContent>
          <TabsContent value="battery">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">Battery Level</span>
                <span
                  className={cn(
                    "text-3xl font-bold",
                    getStatusColor(device.batteryLevel, "battery")
                  )}
                >
                  {device.batteryLevel}%
                </span>
              </div>
              {renderChart("battery", "#10b981")}
            </div>
          </TabsContent>
          <TabsContent value="health">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">Plant Health</span>
                <span
                  className={cn(
                    "text-3xl font-bold capitalize",
                    getStatusColor(0, "health")
                  )}
                >
                  {device.plantHealth}
                </span>
              </div>
              <p className="text-lg">
                {device.plantHealth === "good"
                  ? "Your plant is thriving! Keep up the good work."
                  : device.plantHealth === "medium"
                  ? "Your plant is doing okay, but could use some attention."
                  : "Your plant needs immediate care. Check the moisture and light levels."}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="environment">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">Temperature</span>
                  <span className="text-2xl font-bold">
                    {device.temperature ?? "N/A"}°C
                  </span>
                </div>
                {renderChart("temperature", "#f59e0b")}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">Light Level</span>
                  <span className="text-2xl font-bold">
                    {device.lightLevel ?? "N/A"}%
                  </span>
                </div>
                {renderChart("light", "#6366f1")}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
