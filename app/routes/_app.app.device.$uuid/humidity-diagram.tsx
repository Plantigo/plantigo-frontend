import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface HumidityDiagramProps {
  humidity?: number;
  lastMeasuredAt?: Date;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function HumidityDiagram({
  humidity,
  lastMeasuredAt,
  onRefresh,
  isRefreshing = false,
}: HumidityDiagramProps) {
  if (humidity === undefined || lastMeasuredAt === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Data Available
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          There is no humidity data available for this device yet.
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

  // Humidity range from 0 to 100%
  const circumference = 2 * Math.PI * 90; // 90 is the radius
  const offset = circumference - (humidity / 100) * circumference;

  const getHumidityColor = (level: number) => {
    if (level <= 30) return "text-amber-500";
    if (level <= 60) return "text-blue-500";
    return "text-blue-700";
  };

  const getHumidityBackgroundColor = (level: number) => {
    if (level <= 30) return "text-amber-200";
    if (level <= 60) return "text-blue-200";
    return "text-blue-300";
  };

  const getHumidityTextColor = (level: number) => {
    if (level <= 30) return "text-amber-700";
    if (level <= 60) return "text-blue-700";
    return "text-blue-900";
  };

  const getHumidityStatus = (level: number) => {
    if (level <= 30) {
      return {
        title: "Low Humidity",
        description: "The air is dry. Some plants may need higher humidity.",
      };
    }
    if (level <= 60) {
      return {
        title: "Moderate Humidity",
        description: "Good humidity level for most plants.",
      };
    }
    return {
      title: "High Humidity",
      description: "The air is very humid. Perfect for tropical plants.",
    };
  };

  const status = getHumidityStatus(humidity);
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
            className={getHumidityBackgroundColor(humidity)}
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
          />
          <circle
            className={getHumidityColor(humidity)}
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
            className={`text-4xl font-bold ${getHumidityTextColor(humidity)}`}
          >
            {humidity.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h2
          className={`text-xl font-semibold ${getHumidityTextColor(humidity)}`}
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
