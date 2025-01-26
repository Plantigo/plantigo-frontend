import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Tag,
  ChevronRight,
  ChevronLeft,
  Leaf,
  Check,
  ChevronsUpDown,
  Bluetooth,
  CheckCircle2,
  XCircle,
  EyeOff,
  Eye,
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
import {
  BleClient,
  BleDevice,
  hexStringToDataView,
} from "@capacitor-community/bluetooth-le";
import { CapacitorWifiConnect } from "@falconeta/capacitor-wifi-connect";
import { Capacitor } from "@capacitor/core";
import {
  splitDataIntoPackets,
  START_BYTE,
  END_BYTE,
} from "@/lib/split-data-into-packets";
import { useToast } from "@/hooks/use-toast";
import SsidPlugin from "@/lib/capacitor/ssid-plugin";

const BLE_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
const BLE_WIFI_CREDENTIALS_CHARACTERISTIC_UUID =
  "19b10001-e8f2-537e-4f6c-d104768a1214";

export default function SetupDevicePage() {
  let user = useUserData();
  const [step, setStep] = useState(2);
  const [deviceName, setDeviceName] = useState("");
  const [bluetoothDevice, setBluetoothDevice] = useState<BleDevice | undefined>(
    undefined
  );
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function setSSID() {
      if (Capacitor.getPlatform() === "web") return;

      const { ssid } = await SsidPlugin.getSSID();
      console.log("SSID:", ssid);
    }

    if (step === 2) {
      setSSID();
    }
  }, [step]);

  async function onBluetoothConnect() {
    try {
      await BleClient.initialize();
      const device = await BleClient.requestDevice({
        services: [BLE_SERVICE_UUID],
      });

      await BleClient.connect(device.deviceId, (deviceId) => {
        console.log(`Device ${deviceId} disconnected`);
        setBluetoothDevice(undefined);
        toast({
          title: "Bluetooth connection lost",
          description: "The device has been disconnected. Please try again.",
          variant: "destructive",
        });
        setStep(1);
      });
      setBluetoothDevice(device);
      console.log("connected to device", device);

      // setTimeout(async () => {
      //   await BleClient.disconnect(device.deviceId);
      //   setBluetoothDevice(undefined);
      //   console.log("disconnected from device", device);
      // }, 10000);
    } catch (error) {
      console.error(error);
    }
  }

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

  async function sendWifiCredentialsViaBLE() {
    if (!bluetoothDevice || !wifiSSID || !wifiPassword) return;
    const data = `ssid=${wifiSSID},password=${wifiPassword}`;
    const packetsHex = splitDataIntoPackets(data, START_BYTE, END_BYTE);
    console.log("Packets", packetsHex);

    packetsHex.forEach(async (packetHex) => {
      await BleClient.write(
        bluetoothDevice.deviceId,
        BLE_SERVICE_UUID,
        BLE_WIFI_CREDENTIALS_CHARACTERISTIC_UUID,
        hexStringToDataView(packetHex)
      );
    });
  }

  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);
  const handleFinishSetup = () => {
    console.log("Device Name:", deviceName);
    console.log("Plant Spicies:", comboBoxValue);
  };

  const steps = [
    { number: 1, title: "Bluetooth Setup", icon: Bluetooth },
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
              <div className="space-y-2">
                <div className="flex flex-col items-center justify-between">
                  <h2 className="text-xl text-center pb-3 sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Connect with the device via Bluetooth
                  </h2>
                  {bluetoothDevice ? (
                    <div className="flex items-center gap-2 pb-4 text-green-600 dark:text-green-500">
                      <CheckCircle2 className="h-6 w-6" />
                      <span className="text-lg font-bold">
                        Connected with {bluetoothDevice.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center pb-4 gap-2 text-gray-500">
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Not Connected</span>
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  First, let&apos;s establish a Bluetooth connection with your
                  device. Make sure your device is powered on, then click the
                  button below to start the connection process.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full"
                  variant="secondary"
                  onClick={() => onBluetoothConnect()}
                  disabled={!!bluetoothDevice}
                >
                  <Bluetooth className="mr-2 h-4 w-4" />
                  {bluetoothDevice
                    ? "Device Connected"
                    : "Connect Bluetooth Device"}
                </Button>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleNextStep}
                  disabled={!bluetoothDevice}
                >
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
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
                  You need to provide the WiFi SSID and password to set up the
                  device connection.
                </p>
                <Input
                  type="text"
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                  placeholder="Enter WiFi SSID"
                  className="w-full"
                />
                <div className="relative">
                  <Input
                    type={showWifiPassword ? "text" : "password"}
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Enter WiFi Password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                  >
                    {showWifiPassword ? (
                      <EyeOff className="text-muted-foreground hover:text-primary" />
                    ) : (
                      <Eye className="text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                </div>
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
                  onClick={() => sendWifiCredentialsViaBLE()}
                  disabled={!wifiSSID.trim() || !wifiPassword.trim()}
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
