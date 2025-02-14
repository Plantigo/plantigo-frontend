import { create } from "zustand";
import { BleDevice } from "@capacitor-community/bluetooth-le";

interface BleDeviceState {
  bleDevice: BleDevice | null;
  setBleDevice: (device: BleDevice | null) => void;
  wifiConnected: boolean;
  setWifiConnected: (connected: boolean) => void;
}

export const useBleDeviceStore = create<BleDeviceState>((set) => ({
  bleDevice: null,
  setBleDevice: (bleDevice) => set({ bleDevice }),
  wifiConnected: false,
  setWifiConnected: (wifiConnected) => set({ wifiConnected }),
}));
