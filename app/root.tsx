import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import styles from "./tailwind.css?url";
import { Toaster } from "@/components/ui/toaster";
import { Card } from "./components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "./components/ui/button";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="flex flex-col min-h-screen bg-green-50 relative">
          {children}
          <Toaster />
          <ScrollRestoration />
          <Scripts />
        </main>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <div className="px-6 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle size="48" className="text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900">
            Something went wrong!
          </h1>

          <p className="text-gray-600 text-center  leading-relaxed">
            An error occurred while trying to render this page. Please try again
            later.
          </p>

          <div className="pt-4">
            <Button
              variant="default"
              size="lg"
              className="rounded-full"
              asChild
            >
              <Link to="/">Go to Home</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
