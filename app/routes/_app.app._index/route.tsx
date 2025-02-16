import { type MetaFunction, LoaderFunctionArgs, defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { deviceActions } from "@/actions/devices";
import Dashboard from "./dashboard";
import { LoadingSpinner } from "@/components/loading-spinner";

export const meta: MetaFunction = () => {
  return [
    { title: "Plantigo" },
    { name: "description", content: "Welcome to Plantigo!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return defer({
    devices: deviceActions.getAll(request),
  });
}

export default function DashboardRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <Suspense fallback={<LoadingSpinner />}>
        <Await resolve={data.devices}>
          {(devices) => <Dashboard devices={devices} />}
        </Await>
      </Suspense>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-gray-600">
          Unable to load dashboard data. Please try again later.
        </p>
      </div>
    </div>
  );
}
