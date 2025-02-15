import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Battery, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RenameDeviceDialog } from "./rename-device-dialog";
import {
  Link,
  useLoaderData,
  useSearchParams,
  useFetcher,
} from "@remix-run/react";
import { API_BASE_URL } from "@/lib/env.server";
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { getUserSession } from "@/lib/sessions";
import { useToast } from "@/hooks/use-toast";
import React from "react";

interface Device {
  uuid: string;
  name: string;
  mac_address: string;
  is_active: boolean;
  user: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface RenameResponse {
  error?: string;
  id?: number;
  name?: string;
  mac_address?: string;
  is_active?: boolean;
  user?: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/devices?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Response("Failed to fetch devices", {
        status: response.status,
      });
    }

    const data: PaginatedResponse<Device> = await response.json();
    return json(data);
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw new Response("Failed to fetch devices", { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getUserSession(request);
  const accessToken = session.get("accessToken");

  if (!accessToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const uuid = formData.get("uuid");
  const name = formData.get("name");

  if (!uuid || !name) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/devices/${uuid}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Response("Failed to rename device", {
        status: response.status,
      });
    }

    const updatedDevice = await response.json();
    return json(updatedDevice);
  } catch (error) {
    console.error("Error renaming device:", error);
    throw new Response("Failed to rename device", { status: 500 });
  }
}

export default function SettingsPage() {
  const data = useLoaderData<PaginatedResponse<Device>>();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const fetcher = useFetcher<RenameResponse>();
  const { toast } = useToast();

  const handleRename = (newName: string) => {
    if (!currentDevice || typeof currentDevice.uuid === "undefined") {
      toast({
        title: "Error",
        description: "No device selected",
        variant: "destructive",
      });
      return;
    }

    fetcher.submit(
      {
        uuid: currentDevice.uuid,
        name: newName,
      },
      { method: "PATCH" }
    );

    setIsRenameDialogOpen(false);
  };

  // Show toast when rename operation completes
  React.useEffect(() => {
    if (fetcher.data && !fetcher.data.error) {
      toast({
        title: "Success",
        description: "Device renamed successfully",
      });
      // Update the current device in the list
      setCurrentDevice(null);
    } else if (fetcher.data?.error) {
      console.error(fetcher.data);
      toast({
        title: "Error",
        description: fetcher.data.error,
        variant: "destructive",
      });
    }
  }, [fetcher.data, toast]);

  return (
    <div className="pt-10 w-full">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Devices ({data.count} total)
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="text-green-500"
            asChild
          >
            <Link to="/setup-device">
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Link>
          </Button>
        </div>
        {data.results.map((device) => (
          <Card key={device.mac_address} className="bg-white shadow-sm mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Wifi
                    className={cn(
                      device.is_active ? "text-green-500" : "text-gray-400"
                    )}
                  />
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className="text-sm text-gray-500">
                      {device.mac_address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      device.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {device.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={() => {
                    setCurrentDevice(device);
                    setIsRenameDialogOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Rename
                </Button>
                <Button variant="outline" size="sm" className="text-red-500">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(data.next || data.previous) && (
          <div className="flex justify-center items-center gap-2 mt-6 pb-8">
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={!data.previous}
              className={cn(
                "min-w-[100px] gap-2",
                !data.previous && "opacity-50 cursor-not-allowed"
              )}
            >
              <Link
                to={
                  data.previous
                    ? `?page=${
                        Number(
                          new URL(data.previous).searchParams.get("page")
                        ) || 1
                      }`
                    : "#"
                }
                prefetch="intent"
              >
                ← Previous
              </Link>
            </Button>

            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage}
            </span>

            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={!data.next}
              className={cn(
                "min-w-[100px] gap-2",
                !data.next && "opacity-50 cursor-not-allowed"
              )}
            >
              <Link
                to={
                  data.next
                    ? `?page=${Number(
                        new URL(data.next).searchParams.get("page")
                      )}`
                    : "#"
                }
                prefetch="intent"
              >
                Next →
              </Link>
            </Button>
          </div>
        )}
      </section>

      <RenameDeviceDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        onRename={handleRename}
        currentName={currentDevice?.name || ""}
      />
    </div>
  );
}
