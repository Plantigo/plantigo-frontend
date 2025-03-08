import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface PressureDiagramProps {
  pressure?: number;
  lastMeasuredAt?: Date;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function PressureDiagram({
  pressure,
  lastMeasuredAt,
  onRefresh,
  isRefreshing = false,
}: PressureDiagramProps) {
  if (pressure === undefined || lastMeasuredAt === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Data Available
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          There is no pressure data available for this device yet.
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

  // Pressure range from 950 to 1050 hPa (typical atmospheric pressure range)
  const minPressure = 950;
  const maxPressure = 1050;
  const normalizedPressure = Math.min(
    Math.max(pressure, minPressure),
    maxPressure
  );
  const percentage =
    ((normalizedPressure - minPressure) / (maxPressure - minPressure)) * 100;

  const circumference = 2 * Math.PI * 90; // 90 is the radius
  const offset = circumference - (percentage / 100) * circumference;

  const getPressureColor = (level: number) => {
    if (level < 1000) return "text-indigo-500";
    if (level < 1020) return "text-purple-500";
    return "text-violet-500";
  };

  const getPressureBackgroundColor = (level: number) => {
    if (level < 1000) return "text-indigo-200";
    if (level < 1020) return "text-purple-200";
    return "text-violet-200";
  };

  const getPressureTextColor = (level: number) => {
    if (level < 1000) return "text-indigo-700";
    if (level < 1020) return "text-purple-700";
    return "text-violet-700";
  };

  const getPressureStatus = (level: number) => {
    if (level < 1000) {
      return {
        title: "Low Pressure",
        description:
          "Atmospheric pressure is low. May indicate changing weather.",
      };
    }
    if (level < 1020) {
      return {
        title: "Normal Pressure",
        description: "Atmospheric pressure is within normal range.",
      };
    }
    return {
      title: "High Pressure",
      description:
        "Atmospheric pressure is high. Usually indicates stable weather.",
    };
  };

  const status = getPressureStatus(pressure);
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
            className={getPressureBackgroundColor(pressure)}
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
          />
          <circle
            className={getPressureColor(pressure)}
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
            className={`text-4xl font-bold ${getPressureTextColor(pressure)}`}
          >
            {pressure.toFixed(0)} hPa
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h2
          className={`text-xl font-semibold ${getPressureTextColor(pressure)}`}
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
