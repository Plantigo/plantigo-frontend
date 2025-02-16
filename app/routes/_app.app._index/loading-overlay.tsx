import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({
  message = "Loading...",
}: LoadingOverlayProps) {
  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
