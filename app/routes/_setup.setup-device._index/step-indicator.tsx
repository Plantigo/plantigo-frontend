import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StepIndicatorProps {
  steps: {
    number: number;
    title: string;
    icon: LucideIcon;
  }[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  isActive && "bg-green-500 text-white",
                  isCompleted && "bg-green-200 text-green-700",
                  !isActive && !isCompleted && "bg-gray-100 text-gray-400"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs mt-1 text-center hidden sm:block">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] w-12 mx-2 ms-4",
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
