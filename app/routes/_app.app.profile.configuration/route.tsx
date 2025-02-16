import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserData } from "@/hooks/useUserData";
import { getUser } from "@/lib/get-user.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { UserCircle2, Mail, User, Calendar } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  return new Response(JSON.stringify({ ...user }));
}

export default function ProfileConfiguration() {
  const { user } = useUserData();
  console.log(user);

  return (
    <div className="my-10 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="bg-white px-4 py-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">
          Profile Information
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your account details and information
        </p>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage src={user?.picture} alt="Profile picture" />
            <AvatarFallback>
              <UserCircle2 className="h-full w-full text-emerald-500" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.fullName || user?.name}
            </h2>
            <p className="text-sm text-gray-500">Plant Enthusiast</p>
          </div>
        </div>

        {/* User Information Display */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
            <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900 truncate">{user?.email}</p>
            </div>
          </div>

          {user?.fullName && (
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
              <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-gray-900 truncate">{user?.fullName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
