import { Outlet } from "@remix-run/react";
import { TopBar } from "@/components/top-bar";
import { BottomMenu } from "@/components/bottom-menu";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUser } from "@/lib/get-user.server";
import { tokenCookie } from "../_auth/cookies.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }

  console.log(await tokenCookie.parse(user.request.headers.get("Set-Cookie")));
  const body = JSON.stringify({ userId: user.userId });
  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
      ...request.headers,
    },
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
