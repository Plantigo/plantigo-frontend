import { useUserData } from "@/hooks/useUserData";

export default function SetupDevicePage() {
  let user = useUserData();

  return (
    <div>
      <h1>Devices Setup</h1>
      <p>Welcome to the devices setup page.</p>
    </div>
  );
}
