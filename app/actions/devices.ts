import { apiClient, PaginatedResponse } from "@/lib/api-client";

export interface Device {
  uuid: string;
  name: string;
  mac_address: string;
  is_active: boolean;
  user: number;
}

export const deviceActions = {
  getAll: async (request: Request, page: string = "1") => {
    return apiClient(`/api/v1/devices?page=${page}`, {
      request,
      method: "GET",
    }) as Promise<PaginatedResponse<Device>>;
  },

  update: async (request: Request, uuid: string, data: Partial<Device>) => {
    return apiClient(`/api/v1/devices/${uuid}/`, {
      request,
      method: "PATCH",
      body: JSON.stringify(data),
    }) as Promise<Device>;
  },
};
