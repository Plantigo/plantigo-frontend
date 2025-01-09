import { Link, useLocation } from "@remix-run/react";
import { LeafIcon, MessageSquareDot, User } from "lucide-react";

export function BottomMenu() {
  const location = useLocation();

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-lg border-t border-gray-200 rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {[
              {
                icon: MessageSquareDot,
                label: "Notifications",
                route: "/notifications",
              },
              { icon: LeafIcon, label: "Plants", route: "/" },
              { icon: User, label: "Profile", route: "/profile" },
            ].map(({ icon: Icon, label, route }) => (
              <Link
                key={route}
                to={route}
                className={`flex flex-col items-center space-y-1 relative w-16
              ${
                location.pathname === route
                  ? "text-emerald-500"
                  : "text-gray-500"
              }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{label}</span>
                {location.pathname === route && (
                  <span className="absolute -bottom-[1px] left-1/2 w-12 h-0.5 bg-emerald-500 -translate-x-1/2" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* <footer className="fixed bottom-0 left-0 w-full bg-white z-10 rounded-t-2xl">
        <nav className="bg-white border-t border-gray-200 rounded-t-2xl">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex justify-around">
              <Link
                to="/notifications"
                className="flex flex-col items-center py-2"
              >
                <MessageSquareDot className="w-6 h-6 text-green-600" />
                <span className="mt-1 text-xs text-gray-600">
                  Notifications
                </span>
              </Link>
              <Link to="/" className="flex flex-col items-center py-2">
                <LeafIcon className="w-6 h-6 text-green-600" />
                <span className="mt-1 text-xs text-gray-600">Plants</span>
              </Link>
              <Link to="/settings" className="flex flex-col items-center py-2">
                <User className="w-6 h-6 text-green-600" />
                <span className="mt-1 text-xs text-gray-600">Profile</span>
              </Link>
            </div>
          </div>
        </nav>
      </footer> */}
    </>
  );
}
