import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StepIndicatorProps {
  steps: Array<{
    number: number;
    title: string;
    icon: LucideIcon;
  }>;
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 w-full px-2">
      {steps.map((s, i) => (
        <div key={s.number} className="flex items-center w-full sm:w-auto">
          <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                currentStep >= s.number
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              <s.icon className="w-5 h-5" />
            </div>
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap",
                currentStep >= s.number ? "text-primary" : "text-gray-500"
              )}
            >
              {s.title}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "hidden sm:block h-1 w-24 mx-4 transition-all duration-200",
                currentStep > s.number ? "bg-primary" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
