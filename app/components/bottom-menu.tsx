import { Link, useLocation } from "@remix-run/react";
import { LeafIcon, MessageSquareDot, User } from "lucide-react";
import { useNotificationStore } from "@/stores/notification.store";

export function BottomMenu() {
  const location = useLocation();
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <>
      <nav className="fixed pb-6 pt-2 bottom-0 left-0 right-0 bg-white/60 backdrop-blur-lg border-t border-gray-200 rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {[
              {
                icon: MessageSquareDot,
                label: "Notifications",
                route: "/notifications",
                badge:
                  notifications.length > 0 ? notifications.length : undefined,
              },
              { icon: LeafIcon, label: "Plants", route: "/" },
              { icon: User, label: "Profile", route: "/profile" },
            ].map(({ icon: Icon, label, route, badge }) => (
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
                <div className="relative">
                  <Icon className="h-8 w-8" />
                  {badge !== undefined && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                      {badge}
                    </div>
                  )}
                </div>
                <span className="text-sm">{label}</span>
                {location.pathname === route && (
                  <span className="absolute -bottom-[1px] left-1/2 w-12 h-0.5 bg-emerald-500 -translate-x-1/2" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
