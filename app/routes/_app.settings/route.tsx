import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Battery, Trash2, Plus } from "lucide-react";
import { Device, devices, getBatteryColor } from "@/lib/mocked-devices";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RenameDeviceDialog } from "./rename-device-dialog";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return devices;
}

export default function SettingsPage() {
  const devicesData = useLoaderData<Device[]>();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState({
    id: "1",
    name: "Device 1",
    plant: "Monstera",
  });

  const handleRename = (newName: string) => {
    console.log(`Renaming device ${currentDevice.id} to ${newName}`);
    setCurrentDevice((prev) => ({ ...prev, name: newName }));
    setIsRenameDialogOpen(false);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Devices</h2>
          <Button variant="outline" size="sm" className="text-green-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>
        {devicesData.map((device) => (
          <Card key={device.id} className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Wifi className="text-green-500" />
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className="text-sm text-gray-500">{device.plantName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery
                    className={cn(getBatteryColor(device.batteryLevel))}
                  />
                  <span>{device.batteryLevel}%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={() => setIsRenameDialogOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  Rename
                </Button>
                <Button variant="outline" size="sm" className="text-red-500">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <RenameDeviceDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        onRename={handleRename}
        currentName={currentDevice.name}
      />
    </div>
  );
}
