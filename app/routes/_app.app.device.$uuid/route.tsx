import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { deviceActions } from "@/actions/devices";
import { DeviceDetails } from "./device-details";
export async function loader({ request, params }: LoaderFunctionArgs) {
  const device = await deviceActions.getOne(request, params.uuid!);
  if (!device) {
    throw new Response("Device not found", { status: 404 });
  }
  return json({ device });
}

export default function DeviceRoute() {
  const { device } = useLoaderData<typeof loader>();

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <DeviceDetails device={device} />
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
