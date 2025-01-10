import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.plantigo.app",
  appName: "plantigo",
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
    // CapacitorBrowser: {
    //   userAgent:
    //     "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    // },
  },
};

export default config;
