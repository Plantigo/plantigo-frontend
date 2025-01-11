import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.plantigo.app",
  appName: "Plantigo",
  webDir: "build/client",
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      OverrideUserAgent: "Mozilla/5.0 Google",
    },
  },
  server: {
    url: "http://192.168.1.40:5173/",
    allowNavigation: ["*"],
    cleartext: true,
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for devices...",
        cancel: "Cancel",
        availableDevices: "Available Devices",
        noDevicesFound: "No devices found",
      },
    },
  },
};

export default config;
