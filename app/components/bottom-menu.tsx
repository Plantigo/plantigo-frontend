import { Link } from "@remix-run/react";
import { HomeIcon, LeafIcon, SettingsIcon } from "lucide-react";

export function BottomMenu() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md z-10">
      <nav className="bg-white border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around">
            <Link to="/" className="flex flex-col items-center py-2">
              <HomeIcon className="w-6 h-6 text-green-600" />
              <span className="mt-1 text-xs text-gray-600">Home</span>
            </Link>
            <Link to="/plants" className="flex flex-col items-center py-2">
              <LeafIcon className="w-6 h-6 text-green-600" />
              <span className="mt-1 text-xs text-gray-600">Plants</span>
            </Link>
            <Link to="/settings" className="flex flex-col items-center py-2">
              <SettingsIcon className="w-6 h-6 text-green-600" />
              <span className="mt-1 text-xs text-gray-600">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </footer>
  );
}
