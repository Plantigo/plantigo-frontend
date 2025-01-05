import { getUser } from "@/lib/get-user.server";
import { requireAuth } from "@/lib/require-auth.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const authRequest = await requireAuth(request);
  const user = await getUser(request);

  if (user) {
    if (user.firstLogin) {
      return redirect("/setup-device", {
        headers: authRequest.headers,
      });
    }
    return redirect("/", {
      headers: authRequest.headers,
    });
  }

  return { user: null };
}

export default function AuthLayout() {
  return (
    <main className="relative flex-grow flex items-center justify-center w-full h-screen px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 opacity-50"></div>
      <div className="relative z-10">
        <Outlet />
      </div>
    </main>
  );
}
