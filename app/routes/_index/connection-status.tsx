import { WifiIcon, WifiOffIcon } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({
  isConnected,
}: ConnectionStatusProps) {
  return (
    <div
      className={`flex items-center justify-end ${
        isConnected ? "text-green-600" : "text-red-600"
      }`}
    >
      {isConnected ? (
        <>
          <WifiIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">Device Connected</span>
        </>
      ) : (
        <>
          <WifiOffIcon className="w-5 h-5 mr-2" />
          <span className="text-sm">Device Disconnected</span>
        </>
      )}
    </div>
  );
}
