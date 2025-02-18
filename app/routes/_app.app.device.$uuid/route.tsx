import { type LoaderFunctionArgs, defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { deviceActions } from "@/actions/devices";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";
import { DeviceDetails } from "./device-details";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const devicePromise = deviceActions.getOne(request, params.uuid!);
  return defer({ device: devicePromise });
}

export default function DeviceRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <Await
          resolve={data.device}
          errorElement={
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  Error Loading Device
                </h2>
                <p className="text-gray-600">
                  There was a problem loading the device details.
                </p>
              </div>
            </div>
          }
        >
          {(device) => {
            if (!device) {
              throw new Response("Device not found", { status: 404 });
            }
            return <DeviceDetails device={device} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Device Not Found</h2>
        <p className="text-gray-600">
          The device you're looking for doesn't exist or you don't have access
          to it.
        </p>
      </div>
    </div>
  );
}
