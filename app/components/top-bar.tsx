import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 z-50 border-b border-gray-200
          ${
            scrolled
              ? "bg-white/50 backdrop-blur-lg h-12"
              : "bg-white/70 backdrop-blur-md h-16"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
          {/* Logo section */}
          <div className="flex items-center space-x-2 overflow-hidden">
            <span
              className={`text-3xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent font-bold text-3xltransition-all duration-300
              ${scrolled ? "opacity-0 w-0" : "opacity-100 w-auto"}`}
            >
              Plantigo
            </span>
            <Leaf
              className={`h-6 w-6 text-emerald-500 flex-shrink-0 transition-transform duration-300
              ${scrolled ? "transform scale-90" : ""}`}
            />
          </div>
        </div>
      </header>

      {/* <header className="fixed top-0 left-0 w-full z-10 ">
        <div className="px-4 py-3 flex items-center justify-center">
          <Link to="/">
            <div className="flex items-center">
              <span className="flex items-center justify-center bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent font-bold text-3xl">
                Plantigo <Leaf className="w-8 h-8 text-green-500" />
              </span>
            </div>
          </Link>

          <button
            className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            onClick={handleOpenModal}
          >
            <PowerCircle className="w-5 h-5 mr-1" />
          </button>
        </div>

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
      </header> */}
    </>
  );
}
