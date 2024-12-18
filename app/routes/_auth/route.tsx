import { TopBar } from "@/components/top-bar";
import { getUser } from "@/lib/get-user.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) {
    return redirect("/");
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
