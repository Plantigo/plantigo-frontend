import { create } from "zustand";
import { BleDevice } from "@capacitor-community/bluetooth-le";

interface BleDeviceState {
  bleDevice: BleDevice | null;
  setBleDevice: (device: BleDevice | null) => void;
}

export const useBleDeviceStore = create<BleDeviceState>((set) => ({
  bleDevice: null,
  setBleDevice: (bleDevice) => set({ bleDevice }),
}));
