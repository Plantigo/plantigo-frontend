import { apiClient, PaginatedResponse } from "@/lib/api-client";

export interface Device {
  uuid: string;
  name: string;
  mac_address: string;
  is_active: boolean;
  user: number;
  plant_name: string;
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
};
