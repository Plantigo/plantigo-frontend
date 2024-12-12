import { Outlet } from "@remix-run/react";
import { TopBar } from "@/components/top-bar";
import { BottomMenu } from "@/components/bottom-menu";

export default function AppLayout() {
  return (
    <main className="flex-grow flex items-center justify-center w-full px-14">
      <TopBar />
      <Outlet />
      <BottomMenu />
    </main>
  );
}
