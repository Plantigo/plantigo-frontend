import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div>
      Auth Layout
      <Outlet />
    </div>
  );
}
