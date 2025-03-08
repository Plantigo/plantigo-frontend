import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface TemperatureDiagramProps {
  temperature?: number;
  lastMeasuredAt?: Date;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function TemperatureDiagram({
  temperature,
  lastMeasuredAt,
  onRefresh,
  isRefreshing = false,
}: TemperatureDiagramProps) {
  if (temperature === undefined || lastMeasuredAt === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Data Available
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          There is no temperature data available for this device yet.
        </p>
        <Button
          onClick={onRefresh}
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
    );
  }

  // Temperature range from 0 to 40 degrees Celsius
  const minTemp = 0;
  const maxTemp = 40;
  const normalizedTemp = Math.min(Math.max(temperature, minTemp), maxTemp);
  const percentage = ((normalizedTemp - minTemp) / (maxTemp - minTemp)) * 100;

  const circumference = 2 * Math.PI * 90; // 90 is the radius
  const offset = circumference - (percentage / 100) * circumference;

  const getTemperatureColor = (temp: number) => {
    if (temp <= 15) return "text-blue-500";
    if (temp <= 25) return "text-green-500";
    return "text-red-500";
  };

  const getTemperatureBackgroundColor = (temp: number) => {
    if (temp <= 15) return "text-blue-200";
    if (temp <= 25) return "text-green-200";
    return "text-red-200";
  };

  const getTemperatureTextColor = (temp: number) => {
    if (temp <= 15) return "text-blue-700";
    if (temp <= 25) return "text-green-700";
    return "text-red-700";
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp <= 15) {
      return {
        title: "Cold",
        description:
          "The temperature is low. Some plants may need warmer conditions.",
      };
    }
    if (temp <= 25) {
      return {
        title: "Optimal Temperature",
        description: "Perfect temperature range for most plants.",
      };
    }
    return {
      title: "Hot",
      description:
        "The temperature is high. Consider providing shade or cooling.",
    };
  };

  const status = getTemperatureStatus(temperature);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(lastMeasuredAt);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            className={getTemperatureBackgroundColor(temperature)}
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
          />
          <circle
            className={getTemperatureColor(temperature)}
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-4xl font-bold ${getTemperatureTextColor(
              temperature
            )}`}
          >
            {temperature.toFixed(1)}°C
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h2
          className={`text-xl font-semibold ${getTemperatureTextColor(
            temperature
          )}`}
        >
          {status.title}
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-[250px]">
          {status.description}
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p className="text-xs text-gray-400">
            Last measured: {formattedDate}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn("h-4 w-4", {
                "animate-spin": isRefreshing,
              })}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
