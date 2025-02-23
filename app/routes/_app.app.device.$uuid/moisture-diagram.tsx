import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MoistureDiagramProps {
  moisture: number;
  lastMeasuredAt: Date;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function MoistureDiagram({
  moisture,
  lastMeasuredAt,
  onRefresh,
  isRefreshing = false,
}: MoistureDiagramProps) {
  const circumference = 2 * Math.PI * 90; // 90 is the radius
  const offset = circumference - (moisture / 100) * circumference;

  const getMoistureColor = (level: number) => {
    if (level <= 33) return "text-red-500";
    if (level <= 66) return "text-yellow-500";
    return "text-green-500";
  };

  const getMoistureBackgroundColor = (level: number) => {
    if (level <= 33) return "text-red-200";
    if (level <= 66) return "text-yellow-200";
    return "text-green-200";
  };

  const getMoistureTextColor = (level: number) => {
    if (level <= 33) return "text-red-700";
    if (level <= 66) return "text-yellow-700";
    return "text-green-700";
  };

  const getMoistureStatus = (level: number) => {
    if (level <= 33) {
      return {
        title: "Low Moisture",
        description: "Your plant needs water immediately! The soil is too dry.",
      };
    }
    if (level <= 66) {
      return {
        title: "Moderate Moisture",
        description: "Consider watering soon. The soil is getting dry.",
      };
    }
    return {
      title: "Optimal Moisture",
      description: "Perfect! Your plant has enough water.",
    };
  };

  const status = getMoistureStatus(moisture);
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
            className={getMoistureBackgroundColor(moisture)}
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
          />
          <circle
            className={getMoistureColor(moisture)}
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
            className={`text-4xl font-bold ${getMoistureTextColor(moisture)}`}
          >
            {moisture}%
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h2
          className={`text-xl font-semibold ${getMoistureTextColor(moisture)}`}
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
