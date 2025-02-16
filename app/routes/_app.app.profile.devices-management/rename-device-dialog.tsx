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

interface RenameDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (newName: string) => void;
  device: Device | null;
}

export function RenameDeviceDialog({
  open,
  onOpenChange,
  onRename,
  device,
}: RenameDeviceDialogProps) {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (device) {
      setNewName(device.name);
    }
  }, [device]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onRename(newName.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!newName.trim()} size="lg">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
