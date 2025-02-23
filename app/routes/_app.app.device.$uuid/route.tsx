import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  defer,
} from "@remix-run/node";
import { Await, useLoaderData, useFetcher } from "@remix-run/react";
import { deviceActions } from "@/actions/devices";
import { telemetryActions } from "@/actions/telemetry";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";
import { DeviceDetails } from "./device-details";

export async function action({ request, params }: ActionFunctionArgs) {
  const telemetryData = await telemetryActions.getAll(request, {
    device: params.uuid,
  });
  return telemetryData;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const devicePromise = deviceActions.getOne(request, params.uuid!);
  const telemetryPromise = telemetryActions.getAll(request, {
    device: params.uuid,
  });
  return defer({
    device: devicePromise,
    telemetry: telemetryPromise,
  });
}

export default function DeviceRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <Await
          resolve={Promise.all([data.device, data.telemetry])}
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
          {([device, telemetry]) => {
            if (!device) {
              throw new Response("Device not found", { status: 404 });
            }
            return <DeviceDetails device={device} telemetry={telemetry} />;
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
