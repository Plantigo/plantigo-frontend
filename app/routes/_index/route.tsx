import type { MetaFunction } from "@remix-run/node";
import Dashboard from "./dashboard";
import { Toaster } from "@/components/ui/toaster";

export const meta: MetaFunction = () => {
  return [
    { title: "Plantigo" },
    { name: "description", content: "Welcome to Plantigo!" },
  ];
};

export default function Index() {
  return (
    <div className="w-full">
      <Dashboard />
      <Toaster />
    </div>
  );
}
