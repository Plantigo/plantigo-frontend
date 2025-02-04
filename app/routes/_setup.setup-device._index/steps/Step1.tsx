import { Button } from "@/components/ui/button";
import { BleClient } from "@capacitor-community/bluetooth-le";
import { Bluetooth, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { BLE_SERVICE_UUID } from "../route";
import { useToast } from "@/hooks/use-toast";
import { useBleDeviceStore } from "@/stores/ble-device.store";

interface Step1Props {
  handleNextStep: () => void;
}

export default function Step1({ handleNextStep }: Step1Props) {
  const { toast } = useToast();
  const { bleDevice, setBleDevice, wifiConnected } = useBleDeviceStore();

  function handleBleDisconnect(deviceId: string, isWifiConnected: boolean) {
    console.log(`Device ${deviceId} disconnected`);
    if (!isWifiConnected) {
      toast({
        title: "Device Disconnected",
        description: `Bluetooth connection with device lost. Please try again.`,
        variant: "destructive",
      });
    }
    setBleDevice(null);
  }

  async function onBluetoothConnect() {
    try {
      await BleClient.initialize();
      const device = await BleClient.requestDevice({
        services: [BLE_SERVICE_UUID],
      });

      await BleClient.connect(device.deviceId, (deviceId) =>
        handleBleDisconnect(deviceId, wifiConnected)
      );

      setBleDevice(device);
      console.log("connected to device", device);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-2">
        <div className="flex flex-col items-center justify-between">
          <h2 className="text-xl text-center pb-3 sm:text-2xl font-bold text-gray-900 dark:text-white">
            Connect with the device via Bluetooth
          </h2>
          {bleDevice ? (
            <div className="flex items-center gap-2 pb-4 text-green-600 dark:text-green-500">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-lg font-bold">
                Connected with {bleDevice.name}
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
          First, let&apos;s establish a Bluetooth connection with your device.
          Make sure your device is powered on, then click the button below to
          start the connection process.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          className="w-full"
          variant="secondary"
          onClick={() => onBluetoothConnect()}
          disabled={!!bleDevice}
        >
          <Bluetooth className="mr-2 h-4 w-4" />
          {bleDevice ? "Device Connected" : "Connect Bluetooth Device"}
        </Button>
        <Button
          size="lg"
          className="w-full"
          onClick={handleNextStep}
          disabled={!bleDevice}
        >
          Next Step
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
