import { apiClient, PaginatedResponse } from "@/lib/api-client";

export interface Device {
  uuid: string;
  name: string;
  mac_address: string;
  is_active: boolean;
  user: number;
  plant_name: string;
}

export interface DiagramItem {
  id: string;
  type: "temperature" | "moisture" | "humidity" | "pressure";
}

export interface DashboardLayout {
  uuid: string;
  device: string;
  layout: DiagramItem[];
  created_at: string;
  updated_at: string;
}

export const deviceActions = {
  create: async (request: Request, data: Omit<Device, "uuid" | "user">) => {
    return apiClient("/api/v1/devices/", {
      request,
      method: "POST",
      body: JSON.stringify(data),
    }) as Promise<Device>;
  },

  getAll: async (request: Request, page: string = "1") => {
    return apiClient(`/api/v1/devices?page=${page}`, {
      request,
      method: "GET",
    }) as Promise<PaginatedResponse<Device>>;
  },

  getOne: async (request: Request, uuid: string) => {
    return apiClient(`/api/v1/devices/${uuid}/`, {
      request,
      method: "GET",
    }) as Promise<Device>;
  },

  update: async (request: Request, uuid: string, data: Partial<Device>) => {
    return apiClient(`/api/v1/devices/${uuid}/`, {
      request,
      method: "PATCH",
      body: JSON.stringify(data),
    }) as Promise<Device>;
  },

  delete: async (request: Request, uuid: string) => {
    return apiClient(`/api/v1/devices/${uuid}/`, {
      request,
      method: "DELETE",
    });
  },

  getDashboardLayout: async (request: Request, deviceUuid: string) => {
    return apiClient(`/api/v1/devices/${deviceUuid}/dashboard_layout/`, {
      request,
      method: "GET",
    }) as Promise<DashboardLayout>;
  },

  updateDashboardLayout: async (
    request: Request,
    deviceUuid: string,
    layout: DiagramItem[]
  ) => {
    return apiClient(`/api/v1/devices/${deviceUuid}/dashboard_layout/`, {
      request,
      method: "PUT",
      body: JSON.stringify({ layout }),
    }) as Promise<DashboardLayout>;
  },
};
