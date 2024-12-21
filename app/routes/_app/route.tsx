import { Outlet } from "@remix-run/react";
import { TopBar } from "@/components/top-bar";
import { BottomMenu } from "@/components/bottom-menu";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUser } from "@/lib/get-user.server";
import { requireAuth } from "@/lib/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const authRequest = await requireAuth(request);
  const user = await getUser(authRequest);

  if (!user || !user.userId) {
    return redirect("/login", {
      headers: authRequest?.headers,
    });
  }

  return new Response(JSON.stringify({ userId: user.userId }), {
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
