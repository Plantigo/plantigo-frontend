import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  END_BYTE,
  splitDataIntoPackets,
  START_BYTE,
} from "@/lib/split-data-into-packets";
import {
  BleClient,
  hexStringToDataView,
} from "@capacitor-community/bluetooth-le";
import {
  BLE_SERVICE_UUID,
  BLE_WIFI_CREDENTIALS_CHARACTERISTIC_UUID,
} from "../route";
import { useBleDeviceStore } from "@/stores/ble-device.store";

interface Step2Props {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

export default function Step2({
  handleNextStep,
  handlePreviousStep,
}: Step2Props) {
  const [wifiSSID, setWifiSSID] = useState("Orange_Swiatlowod_E4C0_2.4GHz");
  const [wifiPassword, setWifiPassword] = useState("5EvLo5Ux6rs9HGzjna");
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { bleDevice, setWifiConnected, wifiConnected } = useBleDeviceStore();

  async function sendWifiCredentialsViaBLE() {
    if (!bleDevice || !wifiSSID || !wifiPassword) return;
    setWifiConnected(false);
    setIsLoading(true);

    try {
      await BleClient.startNotifications(
        bleDevice.deviceId,
        BLE_SERVICE_UUID,
        BLE_WIFI_CREDENTIALS_CHARACTERISTIC_UUID,
        async (value) => {
          // This callback will be called when notification is received
          const data = new Uint8Array(value.buffer);
          console.log("Received notification:", data.toString());
          if (data.length === 2 && data[0] === 79 && data[1] === 75) {
            console.log("Received OK notification");
            setWifiConnected(true);
            setIsLoading(false);
            // Stop notifications after receiving OK
            await BleClient.stopNotifications(
              bleDevice.deviceId,
              BLE_SERVICE_UUID,
              BLE_WIFI_CREDENTIALS_CHARACTERISTIC_UUID
            );
            // handleNextStep();
          }
        }
      );

      const data = `ssid=${wifiSSID},password=${wifiPassword}`;
      const packetsHex = splitDataIntoPackets(data, START_BYTE, END_BYTE);

      // Use for...of instead of forEach to ensure sequential execution
      for (const packetHex of packetsHex) {
        await BleClient.write(
          bleDevice.deviceId,
          BLE_SERVICE_UUID,
          BLE_WIFI_CREDENTIALS_CHARACTERISTIC_UUID,
          hexStringToDataView(packetHex)
        );
      }
    } catch (error) {
      console.error("BLE error:", error);
      setWifiConnected(false);
      setIsLoading(false);
      // Stop notifications if there's an error
      await BleClient.stopNotifications(
        bleDevice.deviceId,
        BLE_SERVICE_UUID,
        BLE_WIFI_CREDENTIALS_CHARACTERISTIC_UUID
      );
    }
  }

  return (
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
          You need to provide the WiFi SSID and password to set up the device
          connection.
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
          disabled={wifiConnected}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
          onClick={() =>
            wifiConnected ? handleNextStep() : sendWifiCredentialsViaBLE()
          }
          disabled={!wifiSSID.trim() || !wifiPassword.trim() || isLoading}
        >
          {wifiConnected ? (
            <>
              Connected, go next <ChevronRight className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              {!isLoading ? (
                <>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Connecting <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
