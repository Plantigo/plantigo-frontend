import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Device } from "@/actions/devices";

interface EditDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (data: { name: string; plant_name: string }) => void;
  device: Device | null;
}

export function EditDeviceDialog({
  open,
  onOpenChange,
  onEdit,
  device,
}: EditDeviceDialogProps) {
  const [newName, setNewName] = useState("");
  const [plantName, setPlantName] = useState("");

  useEffect(() => {
    if (device) {
      setNewName(device.name);
      setPlantName(device.plant_name || "");
    }
  }, [device]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onEdit({
        name: newName.trim(),
        plant_name: plantName.trim(),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter device name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plant_name">Plant Name</Label>
            <Input
              id="plant_name"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Enter plant name"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!newName.trim()} size="lg">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
