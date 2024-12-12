import { TopBar } from "@/components/top-bar";
import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="flex-grow flex items-center justify-center w-full px-6">
      <TopBar />
      <Outlet />
    </div>
  );
}
