import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { useToast } from "@/hooks/use-toast";

interface DeviceActionResponse {
  error: string;
}

interface Step4Props {
  handlePreviousStep: () => void;
  onSetDeviceName: (deviceName: string) => void;
  deviceSetupData: {
    macAddress?: string;
    plantName?: string;
    deviceName?: string;
  };
}

export default function Step4({
  handlePreviousStep,
  onSetDeviceName,
  deviceSetupData,
}: Step4Props) {
  const [deviceName, setDeviceName] = useState("");
  const fetcher = useFetcher<DeviceActionResponse>();
  const { toast } = useToast();
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: "Error",
        description: fetcher.data.error,
        variant: "destructive",
      });
    }
  }, [fetcher.data, toast]);

  const handleFinishSetup = () => {
    if (!deviceSetupData.macAddress || !deviceSetupData.plantName) {
      toast({
        title: "Setup Error",
        description: "Missing required device information. Please start over.",
        variant: "destructive",
      });
      return;
    }

    onSetDeviceName(deviceName);
    fetcher.submit(
      {
        name: deviceName,
        mac_address: deviceSetupData.macAddress,
        plant_name: deviceSetupData.plantName,
      },
      { method: "post", action: "/api/devices/create" }
    );
  };

  return (
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
          disabled={isSubmitting}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
          onClick={handleFinishSetup}
          disabled={!deviceName.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              Creating Device <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            </>
          ) : (
            <>
              Complete Setup <Check className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
