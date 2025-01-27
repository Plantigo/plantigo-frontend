import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "@remix-run/react";

interface Step4Props {
  handlePreviousStep: () => void;
}

export default function Step4({ handlePreviousStep }: Step4Props) {
  const [deviceName, setDeviceName] = useState("");
  const handleFinishSetup = () => {};

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
  );
}
