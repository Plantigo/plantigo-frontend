import {
  defer,
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {
  Await,
  useLoaderData,
  useNavigation,
  useActionData,
} from "@remix-run/react";
import { DeviceDetails } from "./device-details";
import { Device, DiagramItem, deviceActions } from "@/actions/devices";
import {
  type PaginatedResponse,
  type Telemetry,
  telemetryActions,
} from "@/actions/telemetry";
import { getUserSession } from "@/lib/sessions";
import { Loader2 } from "lucide-react";
import { Suspense, useState, useEffect } from "react";

// Define action data type
interface SaveLayoutActionData {
  success: boolean;
  layout?: DiagramItem[];
  error?: string;
  _action?: string;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getUserSession(request);
  if (!session.get("accessToken")) {
    return redirect("/login");
  }

  const { uuid } = params;

  if (!uuid) {
    return redirect("/app");
  }

  // Start data fetching promises without awaiting them
  const devicePromise = deviceActions.getOne(request, uuid);
  const telemetryPromise = telemetryActions.getAll(request, { device: uuid });
  const dashboardLayoutPromise = deviceActions
    .getDashboardLayout(request, uuid)
    .then((response) => response.layout)
    .catch(() => undefined);

  // Defer the response to enable streaming and Suspense
  return defer({
    device: devicePromise,
    telemetry: telemetryPromise,
    dashboardLayout: dashboardLayoutPromise,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getUserSession(request);
  if (!session.get("accessToken")) {
    return redirect("/login");
  }

  const { uuid } = params;

  if (!uuid) {
    return redirect("/app");
  }

  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "saveDashboardLayout") {
    try {
      const layoutJson = formData.get("layout") as string;
      const layout = JSON.parse(layoutJson) as DiagramItem[];

      await deviceActions.updateDashboardLayout(request, uuid, layout);
      return json<SaveLayoutActionData>({
        success: true,
        layout,
        _action: "saveDashboardLayout",
      });
    } catch (error) {
      console.error("Error saving dashboard layout:", error);
      return json<SaveLayoutActionData>(
        { success: false, error: "Failed to save dashboard layout" },
        { status: 500 }
      );
    }
  }

  // Refresh telemetry data
  if (_action === "refreshTelemetry") {
    try {
      const telemetry = await telemetryActions.getAll(request, {
        device: uuid,
      });
      return json({
        success: true,
        telemetry,
        _action: "refreshTelemetry",
      });
    } catch (error) {
      console.error("Error refreshing telemetry:", error);
      return json(
        {
          success: false,
          error: "Failed to refresh telemetry",
          _action: "refreshTelemetry",
        },
        { status: 500 }
      );
    }
  }

  // Default action - just return empty success
  return json({ success: true });
}

export default function DeviceRoute() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<SaveLayoutActionData>();
  const navigation = useNavigation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track if this is the first load
  useEffect(() => {
    if (isInitialLoad && navigation.state === "idle") {
      setIsInitialLoad(false);
    }
  }, [navigation.state, isInitialLoad]);

  // Check if this is a layout update action
  const isLayoutUpdate =
    actionData && actionData._action === "saveDashboardLayout";

  // Skip Suspense for layout updates or after initial load
  const skipSuspense = !isInitialLoad || isLayoutUpdate;

  // If we're skipping Suspense and have all the data resolved, render directly
  if (
    skipSuspense &&
    !(data.device instanceof Promise) &&
    !(data.telemetry instanceof Promise) &&
    !(data.dashboardLayout instanceof Promise)
  ) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <DeviceDetails
          device={data.device}
          telemetry={data.telemetry}
          dashboardLayout={data.dashboardLayout}
        />
      </div>
    );
  }

  // Use Suspense for the initial load only
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground font-medium">
              Loading device data...
            </p>
          </div>
        }
      >
        <Await
          resolve={Promise.all([
            data.device,
            data.telemetry,
            data.dashboardLayout,
          ])}
          errorElement={
            <div className="flex items-center justify-center p-8">
              <p className="text-destructive">Failed to load device data</p>
            </div>
          }
        >
          {([device, telemetry, dashboardLayout]) => (
            <DeviceDetails
              device={device}
              telemetry={telemetry}
              dashboardLayout={dashboardLayout}
            />
          )}
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
