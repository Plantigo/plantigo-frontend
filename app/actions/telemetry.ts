import { apiClient, PaginatedResponse } from "@/lib/api-client";

export type { PaginatedResponse };

export interface Telemetry {
  uuid: string;
  device: string;
  device_name: string;
  device_mac: string;
  temperature: number;
  humidity: number;
  pressure: number;
  soil_moisture: number;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

interface GetAllTelemetryParams {
  page?: string;
  device?: string;
}

export const telemetryActions = {
  getAll: async (request: Request, params?: GetAllTelemetryParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page);
    if (params?.device) searchParams.append("device", params.device);

    const queryString = searchParams.toString();
    return apiClient(
      `/api/v1/telemetry${queryString ? `?${queryString}` : ""}`,
      {
        request,
        method: "GET",
      }
    ) as Promise<PaginatedResponse<Telemetry>>;
  },
};
