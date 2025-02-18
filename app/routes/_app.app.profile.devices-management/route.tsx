import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  Trash2,
  Plus,
  WifiOff,
  Sprout,
  CircuitBoard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Link,
  useLoaderData,
  useSearchParams,
  useFetcher,
  Await,
  useNavigation,
} from "@remix-run/react";
import { LoaderFunctionArgs, ActionFunctionArgs, json } from "@remix-run/node";
import { useToast } from "@/hooks/use-toast";
import React, { Suspense } from "react";
import { Device, deviceActions } from "@/actions/devices";
import { PaginatedResponse } from "@/lib/api-client";
import { LoadingSpinner } from "@/components/loading-spinner";
import { EditDeviceDialog } from "./rename-device-dialog";
import { DeleteDeviceDialog } from "./delete-device-dialog";

interface RenameResponse extends Device {
  error?: string;
}

interface ActionResponse {
  error?: string;
  success?: boolean;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";

  return {
    devices: deviceActions.getAll(request, page),
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const uuid = formData.get("uuid");

  if (!uuid) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  if (intent === "delete") {
    try {
      await deviceActions.delete(request, uuid.toString());
      return json({ success: true });
    } catch (error: any) {
      console.error("Error deleting device:", error);
      return json(
        { error: error.message || "Failed to delete device" },
        { status: 500 }
      );
    }
  }

  if (intent === "rename") {
    const name = formData.get("name");
    const plant_name = formData.get("plant_name");
    if (!name) {
      return json({ error: "Missing name field" }, { status: 400 });
    }

    try {
      const updatedDevice = await deviceActions.update(
        request,
        uuid.toString(),
        {
          name: name.toString(),
          plant_name: plant_name?.toString() || "",
        }
      );
      return json(updatedDevice);
    } catch (error) {
      console.error("Error updating device:", error);
      return json({ error: "Failed to update device" }, { status: 500 });
    }
  }

  return json({ error: "Invalid intent" }, { status: 400 });
}

export default function SettingsPage() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [optimisticDeviceName, setOptimisticDeviceName] = useState<{
    uuid: string;
    name: string;
    plant_name: string;
  } | null>(null);
  const [deletedDeviceIds, setDeletedDeviceIds] = useState<string[]>([]);
  const { toast } = useToast();
  const fetcher = useFetcher<ActionResponse | Device>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const getPageFromUrl = (url: string | null) => {
    if (!url) return null;
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get("page");
    // If no page parameter is found, it means we're going to page 1
    return page || "1";
  };

  const handleDelete = () => {
    if (!deviceToDelete) return;

    // Add the device to the optimistically deleted list
    setDeletedDeviceIds((prev) => [...prev, deviceToDelete.uuid]);

    const formData = new FormData();
    formData.append("uuid", deviceToDelete.uuid);
    formData.append("intent", "delete");

    fetcher.submit(formData, { method: "post" });
    setDeviceToDelete(null);
  };

  const handleRename = (data: { name: string; plant_name: string }) => {
    if (!selectedDevice) return;

    setOptimisticDeviceName({
      uuid: selectedDevice.uuid,
      name: data.name,
      plant_name: data.plant_name,
    });

    const formData = new FormData();
    formData.append("uuid", selectedDevice.uuid);
    formData.append("name", data.name);
    formData.append("plant_name", data.plant_name);
    formData.append("intent", "rename");

    fetcher.submit(formData, { method: "post" });
    setSelectedDevice(null);
  };

  // Reset optimistic states when navigation occurs
  React.useEffect(() => {
    if (navigation.state === "loading") {
      setDeletedDeviceIds([]);
      setOptimisticDeviceName(null);
    }
  }, [navigation.state]);

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if ("error" in fetcher.data && fetcher.data.error) {
        // If there's an error, we need to remove the device from the deleted list
        if (deviceToDelete) {
          setDeletedDeviceIds((prev) =>
            prev.filter((id) => id !== deviceToDelete.uuid)
          );
        }
        toast({
          title: "Error",
          description: fetcher.data.error,
          variant: "destructive",
        });
      } else if ("success" in fetcher.data && fetcher.data.success) {
        toast({
          title: "Success",
          description: "Device deleted successfully",
        });
      }
      setOptimisticDeviceName(null);
    }
  }, [fetcher.state, fetcher.data, toast, deviceToDelete]);

  const getDeviceName = (device: Device) => {
    if (optimisticDeviceName?.uuid === device.uuid) {
      return optimisticDeviceName.name;
    }
    return device.name;
  };

  const getPlantName = (device: Device) => {
    if (optimisticDeviceName?.uuid === device.uuid) {
      return optimisticDeviceName.plant_name;
    }
    return device.plant_name;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Suspense fallback={<LoadingSpinner />}>
        <Await resolve={data.devices}>
          {(devices) => {
            // Filter out optimistically deleted devices
            const filteredDevices = {
              ...devices,
              results: devices.results.filter(
                (device) => !deletedDeviceIds.includes(device.uuid)
              ),
            };

            return (
              <>
                {isLoading ? (
                  <div className="fixed inset-0 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="w-full max-w-[600px] px-4 py-8">
                    <div className="space-y-4">
                      <h1 className="text-3xl font-bold">Devices Management</h1>
                      {filteredDevices.results.length > 0 && (
                        <Button asChild className="w-full" size="lg">
                          <Link to="/setup-device" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Device
                          </Link>
                        </Button>
                      )}
                    </div>

                    {filteredDevices.results.length === 0 ? (
                      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
                        <h2 className="text-2xl font-semibold">
                          No Devices Connected
                        </h2>
                        <p className="text-muted-foreground max-w-md">
                          Get started by connecting your first Plantigo device.
                        </p>
                        <Button size="lg" asChild>
                          <Link to="/setup-device" className="gap-2 text-lg">
                            <Plus className="w-5 h-5" />
                            Add Your First Device
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6 py-6">
                        <div className="space-y-4">
                          {filteredDevices.results.map((device) => (
                            <Card key={device.uuid}>
                              <CardContent className="p-4 relative">
                                <div
                                  className={cn(
                                    "absolute top-4 right-4 sm:top-6 sm:right-6",
                                    "flex items-center gap-2 px-3 py-1 rounded-full",
                                    device.is_active
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : "bg-rose-500/10 text-rose-500"
                                  )}
                                >
                                  {device.is_active ? (
                                    <>
                                      <Wifi className="w-4 h-4" />
                                      <span className="text-xs font-medium">
                                        Online
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <WifiOff className="w-4 h-4" />
                                      <span className="text-xs font-medium">
                                        Offline
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="flex flex-col h-full">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-2 sm:mb-3">
                                      <h3 className="text-lg sm:text-xl font-semibold truncate pr-24 sm:pr-32">
                                        {getDeviceName(device)}
                                      </h3>
                                    </div>
                                    <div className="space-y-1.5">
                                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <Sprout className="text-primary w-5 h-5" />
                                        {getPlantName(device) ? (
                                          getPlantName(device)
                                        ) : (
                                          <span className="italic">
                                            Plant name not set
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <CircuitBoard className="text-primary w-5 h-5" />
                                        <span className="font-mono text-xs">
                                          {device.mac_address}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex justify-end items-center gap-3 mt-4 sm:mt-6 pt-2 sm:pt-4 border-t">
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedDevice(device)}
                                      disabled={fetcher.state === "submitting"}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => setDeviceToDelete(device)}
                                      disabled={fetcher.state === "submitting"}
                                    >
                                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        {filteredDevices.results.length > 0 &&
                          (filteredDevices.next ||
                            filteredDevices.previous) && (
                            <div className="flex justify-center gap-2 sm:gap-4">
                              {filteredDevices.previous ? (
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    to={`?page=${getPageFromUrl(
                                      filteredDevices.previous
                                    )}`}
                                    prefetch="intent"
                                  >
                                    Previous
                                  </Link>
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" disabled>
                                  Previous
                                </Button>
                              )}
                              <div className="flex items-center">
                                <span className="text-xs sm:text-sm text-muted-foreground">
                                  Page {searchParams.get("page") || "1"} of{" "}
                                  {Math.ceil(filteredDevices.count / 10)}
                                </span>
                              </div>
                              {filteredDevices.next ? (
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    to={`?page=${getPageFromUrl(
                                      filteredDevices.next
                                    )}`}
                                    prefetch="intent"
                                  >
                                    Next
                                  </Link>
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" disabled>
                                  Next
                                </Button>
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          }}
        </Await>
      </Suspense>

      <EditDeviceDialog
        open={!!selectedDevice}
        onOpenChange={(open) => !open && setSelectedDevice(null)}
        onEdit={handleRename}
        device={selectedDevice}
      />

      <DeleteDeviceDialog
        open={!!deviceToDelete}
        onOpenChange={(open) => !open && setDeviceToDelete(null)}
        onDelete={handleDelete}
        device={deviceToDelete}
        isDeleting={fetcher.state === "submitting"}
      />
    </div>
  );
}
