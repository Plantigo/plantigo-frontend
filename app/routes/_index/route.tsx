import type { MetaFunction } from "@remix-run/node";
import ConnectionStatus from "./connection-status";
import MoistureDiagram from "./moisture-diagram";
import BottomMenu from "./bottom-menu";
import TopBar from "./top-bar";

export const meta: MetaFunction = () => {
  return [
    { title: "Plantigo" },
    { name: "description", content: "Welcome to Plantigo!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <TopBar />
      <header className="p-4">
        <ConnectionStatus isConnected={true} />
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <MoistureDiagram moisture={65} />
      </main>
      <footer className="mt-auto">
        <BottomMenu />
      </footer>
    </div>
  );
}
