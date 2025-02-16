import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/hooks/useUserData";
import { getUser } from "@/lib/get-user.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import {
  ChevronRight,
  HelpCircle,
  Info,
  LogOut,
  MessageSquareDot,
  Settings,
  Share2,
  UserCircle2,
} from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  return new Response(JSON.stringify({ ...user }));
}

export default function Profile() {
  const { user } = useUserData();
  const { toast } = useToast();
  const fetcher = useFetcher();

  const menuItems = [
    {
      title: "Device Management",
      icon: Share2,
      color: "bg-blue-100 text-blue-600",
      route: "/devices-management",
      section: 1,
    },
    {
      title: "Plant Notifications",
      icon: MessageSquareDot,
      color: "bg-indigo-100 text-indigo-600",
      route: "/profile",
      section: 1,
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      color: "bg-amber-100 text-amber-600",
      route: "/profile",
      section: 1,
    },
    {
      title: "About Plantigo",
      icon: Info,
      color: "bg-emerald-100 text-emerald-600",
      route: "/profile",
      section: 1,
    },
    {
      title: "Settings",
      icon: Settings,
      color: "bg-gray-100 text-gray-600",
      route: "/settings",
      section: 2,
    },
    {
      title: "Logout",
      icon: LogOut,
      color: "bg-gray-100 text-gray-600",
      callback: () => {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        fetcher.submit({}, { method: "POST", action: "/logout" });
      },
      section: 2,
    },
  ];

  return (
    <div className="pt-20 pb-24">
      <Link to="/profile/configuration">
        <div className="flex items-center space-x-4 mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="relative">
            <Avatar>
              <AvatarImage src={user?.picture} alt="Profile picture" />
              <AvatarFallback>
                <UserCircle2 className="h-16 w-16 text-emerald-500" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.fullName ?? user?.email}
            </h2>
            <p className="text-sm text-gray-500">Plant Enthusiast</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </Link>

      {[1, 2].map((section) => (
        <div
          key={section}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
        >
          {menuItems
            .filter((item) => item.section === section)
            .map((item, index) => (
              <div
                key={item.title}
                role="button"
                tabIndex={0}
                className={`w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer
                    ${index !== 0 ? "border-t border-gray-100" : ""}`}
                onClick={() => {
                  if (item.callback) {
                    item.callback();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (item.callback) {
                      item.callback();
                    }
                  }
                }}
              >
                <Link
                  to={item.route || "#"}
                  className="flex items-center space-x-4 w-full"
                >
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="flex-1 text-left text-gray-900">
                    {item.title}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
