import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { Link } from "@remix-run/react";
import { StepIndicator } from "./step-indicator";
import Step2 from "./steps/Step2";
import { Bluetooth, Leaf, Tag, Wifi } from "lucide-react";
import Step1 from "./steps/Step1";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

export const BLE_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
export const BLE_WIFI_CREDENTIALS_CHARACTERISTIC_UUID =
  "19b10001-e8f2-537e-4f6c-d104768a1214";

export default function SetupDevicePage() {
  let user = useUserData();
  const [step, setStep] = useState(1);

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);

  const steps = [
    { number: 1, title: "Bluetooth Setup", icon: Bluetooth },
    { number: 2, title: "Connect to Wifi", icon: Wifi },
    { number: 3, title: "Plant Species", icon: Leaf },
    { number: 4, title: "Name", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-24">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Logo & Welcome */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent pb-1"
          >
            Plantigo <Leaf className="w-6 h-6 ml-1 text-green-500" />
          </Link>
          {step === 1 && (
            <p className="text-base text-gray-600 dark:text-gray-300">
              Let&apos;s configure your device by connecting to WiFi.
            </p>
          )}
          {step === 2 && (
            <p className="text-base text-gray-600 dark:text-gray-300">
              Now, connect your device to the network.
            </p>
          )}
          {step === 3 && (
            <p className="text-base text-gray-600 dark:text-gray-300">
              Set the plant species.
            </p>
          )}
          {step === 4 && (
            <p className="text-base text-gray-600 dark:text-gray-300">
              Finally, give your device a name.
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <StepIndicator steps={steps} currentStep={step} />

        {/* Content Sections */}
        <div className="space-y-6 pt-4">
          {step === 1 && <Step1 handleNextStep={handleNextStep} />}

          {step === 2 && (
            <Step2
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
            />
          )}

          {step === 3 && (
            <Step3
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
            />
          )}

          {step === 4 && <Step4 handlePreviousStep={handlePreviousStep} />}
        </div>
      </div>
    </div>
  );
}
