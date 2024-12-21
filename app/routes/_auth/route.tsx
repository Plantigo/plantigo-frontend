import { TopBar } from "@/components/top-bar";
import { getUser } from "@/lib/get-user.server";
import { requireAuth } from "@/lib/sessions";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const authRequest = await requireAuth(request);
  const user = await getUser(authRequest);

  if (user && user.userId) {
    return redirect("/", {
      headers: authRequest?.headers,
    });
  }

  return { userId: null };
}

export default function AuthLayout() {
  return (
    <div className="flex-grow flex items-center justify-center w-full px-6">
      <TopBar />
      <Outlet />
    </div>
  );
}
