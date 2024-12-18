import { type MetaFunction } from "@remix-run/node";
import Dashboard from "./dashboard";

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
    </div>
  );
}
