import { useState } from "react";
import { Leaf, PowerCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useFetcher } from "@remix-run/react";
import { useUserData } from "@/hooks/useUserData";

interface ButtonData {
  variant: ButtonProps["variant"];
  label: string;
  onClick?: () => void;
  link?: string;
}

export function TopBar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const fetcher = useFetcher();
  const { user } = useUserData();

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
    fetcher.submit({}, { method: "POST", action: "/logout" });
    setModalOpen(false);
  };

  const authButtons: ButtonData[] = [
    {
      variant: "default",
      label: "Restart Devices",
      onClick: handleRestartDevices,
    },
    {
      variant: "default",
      label: "Shutdown Devices",
      onClick: handleShutdownDevices,
    },
    {
      variant: "destructive",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const noAuthButtons: ButtonData[] = [
    {
      variant: "secondary",
      label: "Sign In",
      link: "/login",
    },
    {
      variant: "default",
      label: "Sign Up",
      link: "/register",
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="bg-white shadow-sm py-1">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center">
              <Leaf className="w-6 h-6 text-green-600 mr-2" />
              <h1 className="text-xl font-bold text-green-800">Plantigo</h1>
            </div>
          </Link>

          {user?.email}
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
              {user &&
                authButtons.map((btn, index) => (
                  <Button
                    key={index}
                    variant={btn.variant}
                    className="w-full"
                    onClick={btn.onClick}
                  >
                    {btn.label}
                  </Button>
                ))}

              {!user &&
                noAuthButtons.map((btn, index) => (
                  <Button
                    key={index}
                    variant={btn.variant}
                    className="w-full"
                    asChild={!!btn.link}
                  >
                    {btn.link ? (
                      <Link to={btn.link} onClick={handleCloseModal}>
                        {btn.label}
                      </Link>
                    ) : (
                      btn.label
                    )}
                  </Button>
                ))}
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
    </header>
  );
}
