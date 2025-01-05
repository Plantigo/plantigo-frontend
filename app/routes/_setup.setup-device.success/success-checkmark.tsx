import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessCheckmarkProps {
  className?: string;
}

export function SuccessCheckmark({ className }: SuccessCheckmarkProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
      <div className="relative bg-green-500 rounded-full p-4 animate-bounce">
        <Check className="w-12 h-12 text-white" strokeWidth={3} />
      </div>
    </div>
  );
}
