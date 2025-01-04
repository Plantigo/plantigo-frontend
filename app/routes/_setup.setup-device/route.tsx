import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Wifi,
  Laptop,
  Tag,
  ChevronRight,
  ChevronLeft,
  Leaf,
} from "lucide-react";
import { StepIndicator } from "./step-indicator";
import { Link } from "@remix-run/react";

export default function SetupDevicePage() {
  let user = useUserData();
  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState("");

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);
  const handleFinishSetup = () => {
    // Handle device setup completion logic here
    console.log("Device Name:", deviceName);
  };

  const steps = [
    { number: 1, title: "WiFi Setup", icon: Wifi },
    { number: 2, title: "Connect Device", icon: Laptop },
    { number: 3, title: "Device Name", icon: Tag },
  ];

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8 sm:space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 px-4">
          {step === 1 ? (
            <>
              <h1 className="text-5xl sm:text-4xl font-bold justify-center items-center flex flex-col gap-2">
                Welcome to
                <Link
                  to="/"
                  className="text-6xl flex items-center justify-center bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent pb-2"
                >
                  Plantigo <Leaf className="w-8 h-8 text-green-500" />
                </Link>
              </h1>
              <p className="py-4 text-xl text-gray-600 dark:text-gray-300">
                Now you&apos;ll configure your first device
              </p>
            </>
          ) : (
            <h1 className="text-6xl font-bold justify-center items-center flex flex-col gap-2">
              <Link
                to="/"
                className="flex items-center justify-center bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent pb-2"
              >
                Plantigo <Leaf className="w-8 h-8 text-green-500" />
              </Link>
            </h1>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <StepIndicator steps={steps} currentStep={step} />
        </div>

        {/* Content Card */}
        <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Connect to WiFi Network
                </h2>
                <p className="text-lg sm:text-base text-gray-500 dark:text-gray-400">
                  First, let&apos;s connect your device to your WiFi network.
                  Click the button below to open your WiFi settings.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full"
                  variant="secondary"
                  onClick={() => (window.location.href = "wifi://")}
                >
                  <Wifi className="w-8 h-8" />
                  Open WiFi Settings
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
                  onClick={handleNextStep}
                >
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Connect Your Device
                </h2>
                <img
                  src="/device-connect.jpg"
                  alt="Device Connect"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="text-lg font-semibold sm:text-base text-gray-500 dark:text-gray-400">
                  Now, open your browser and navigate to{" "}
                  <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    192.168.1.1
                  </span>{" "}
                  to complete the device connection process.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handlePreviousStep}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Step
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
                  onClick={handleNextStep}
                >
                  Device Connected
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Name Your Device
                </h2>
                <img
                  src="/device-setup-complete.jpg"
                  alt="Device Setup Complete"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                  Give your device a unique name to easily identify it later.
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Enter device name"
                  className="text-base sm:text-lg"
                />
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handlePreviousStep}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Step
                  </Button>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
                    onClick={handleFinishSetup}
                    disabled={!deviceName.trim()}
                  >
                    Complete Setup
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
