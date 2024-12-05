import type { MetaFunction } from "@remix-run/node";
import ConnectionStatus from "./connection-status";
import MoistureDiagram from "./moisture-diagram";
import BottomMenu from "../../components/bottom-menu";
import TopBar from "../../components/top-bar";
import Dashboard from "./dashboard";
import { Toaster } from "~/components/ui/toaster";

export const meta: MetaFunction = () => {
  return [
    { title: "Plantigo" },
    { name: "description", content: "Welcome to Plantigo!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50 relative">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10 p-4 pb-0">
        <TopBar />
        {/* <ConnectionStatus isConnected={true} /> */}
      </header>

      <main className="flex-grow flex items-center justify-center p-4 pt-[5rem] pb-[5rem]">
        <Dashboard />
        <Toaster />
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md z-10 p-4 pt-0">
        <BottomMenu />
      </footer>
    </div>
  );
}
