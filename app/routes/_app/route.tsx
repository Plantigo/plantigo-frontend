import { Outlet } from "@remix-run/react";
import { TopBar } from "@/components/top-bar";
import { BottomMenu } from "@/components/bottom-menu";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUser } from "@/lib/get-user.server";
import { requireAuth } from "@/lib/require-auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const authRequest = await requireAuth(request);
  const user = await getUser(request);

  if (!user) {
    return redirect("/login", {
      headers: authRequest?.headers,
    });
  }

  return new Response(JSON.stringify({ ...user }), {
    headers: authRequest?.headers,
  });
}

export default function AppLayout() {
  return (
    <main className="flex-grow flex items-center justify-center w-full px-14">
      <TopBar />
      <Outlet />
      <BottomMenu />
    </main>
  );
}
