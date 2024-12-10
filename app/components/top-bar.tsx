import { useState } from "react";
import { Leaf, PowerCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function TopBar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleRestartDevices = () => {
    toast({
      title: "Devices Restarted",
      description: "All devices have been successfully restarted.",
    });
    setModalOpen(false);
  };

  const handleShutdownDevices = () => {
    toast({
      title: "Devices Shutdown",
      description: "All devices have been successfully shut down.",
    });
    setModalOpen(false);
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setModalOpen(false);
  };

  return (
    <div className="bg-white shadow-sm py-1">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Leaf className="w-6 h-6 text-green-600 mr-2" />
          <h1 className="text-xl font-bold text-green-800">Plantigo</h1>
        </div>

        <button
          className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          onClick={handleOpenModal}
        >
          <PowerCircle className="w-5 h-5 mr-1" />
        </button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              variant="default"
              className="w-full"
              onClick={handleRestartDevices}
            >
              Restart Devices
            </Button>
            <Button
              variant="default"
              className="w-full"
              onClick={handleShutdownDevices}
            >
              Shutdown Devices
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
