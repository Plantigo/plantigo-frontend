import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  Laptop,
  Tag,
  ChevronRight,
  ChevronLeft,
  Leaf,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { StepIndicator } from "./step-indicator";
import { Link } from "@remix-run/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function SetupDevicePage() {
  let user = useUserData();
  const [step, setStep] = useState(1);
  const [deviceName, setDeviceName] = useState("");

  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const [comboBoxValue, setComboBoxValue] = useState("");

  const plantSpicies = [
    {
      value: "rose",
      label: "Rose",
    },
    {
      value: "tulip",
      label: "Tulip",
    },
    {
      value: "orchid",
      label: "Orchid",
    },
    {
      value: "sunflower",
      label: "Sunflower",
    },
    {
      value: "daisy",
      label: "Daisy",
    },
  ];

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);
  const handleFinishSetup = () => {
    console.log("Device Name:", deviceName);
    console.log("Plant Spicies:", comboBoxValue);
  };

  const steps = [
    { number: 1, title: "WiFi", icon: Wifi },
    { number: 2, title: "Connect", icon: Laptop },
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
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">
                  Connect to WiFi Network
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  First, let&apos;s connect your device to your WiFi network.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  variant="secondary"
                  onClick={() => (window.location.href = "wifi://")}
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  Open WiFi Settings
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
                  onClick={handleNextStep}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Connect Your Device</h2>
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src="/device-connect.jpg"
                    alt="Device Connect"
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Open your browser and navigate to{" "}
                  <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm">
                    192.168.1.1
                  </code>
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handlePreviousStep}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
                  onClick={handleNextStep}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Set Plant Species</h2>
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src="/species-step.jpg"
                    alt="Species Step"
                    className="object-cover w-full h-full"
                  />
                </div>
                <Popover open={comboBoxOpen} onOpenChange={setComboBoxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      size="lg"
                      aria-expanded={comboBoxOpen}
                      className="w-full justify-between"
                    >
                      {comboBoxValue
                        ? plantSpicies.find(
                            (framework) => framework.value === comboBoxValue
                          )?.label
                        : "Select plant..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[345px] sm:w-[415px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search plant..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No plant spicies found.</CommandEmpty>
                        <CommandGroup>
                          {plantSpicies.map((spicies) => (
                            <CommandItem
                              key={spicies.value}
                              value={spicies.value}
                              onSelect={(currentValue) => {
                                setComboBoxValue(
                                  currentValue === comboBoxValue
                                    ? ""
                                    : currentValue
                                );
                                setDeviceName(
                                  `${currentValue.toLowerCase()}_device`
                                );
                                setComboBoxOpen(false);
                              }}
                            >
                              {spicies.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  comboBoxValue === spicies.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handlePreviousStep}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
                  onClick={handleNextStep}
                  disabled={!comboBoxValue}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Name Your Device</h2>
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src="/device-setup-complete.jpg"
                    alt="Device Setup Complete"
                    className="object-cover w-full h-full"
                  />
                </div>
                <Input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Enter device name"
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handlePreviousStep}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
                  onClick={handleFinishSetup}
                  disabled={!deviceName.trim()}
                  asChild
                >
                  <Link to="/setup-device/success">
                    Complete Setup <Check className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
