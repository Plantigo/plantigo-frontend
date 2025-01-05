import { Button } from "@/components/ui/button";
import { ConfettiAnimation } from "./confetti-animation";
import { SuccessCheckmark } from "./success-checkmark";
import { Link } from "@remix-run/react";

export default function DeviceSuccessPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <ConfettiAnimation />

      <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <SuccessCheckmark className="mb-4" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            New device added!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            Your device is now ready to use
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
          <Link to="/">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
            >
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/setup-device">
            <Button variant="outline" size="lg" className="w-full">
              Add Another Device
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
