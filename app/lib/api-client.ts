import { API_BASE_URL } from "./env.server";
import { getUserSession } from "./sessions";

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: HeadersInit;
  request?: Request;
}

interface ApiClientError extends Error {
  status?: number;
}

class ApiError extends Error implements ApiClientError {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function apiClient(
  endpoint: string,
  { request, ...customConfig }: RequestOptions = {}
) {
  if (!request) {
    throw new ApiError(
      "Request object is required for server-side API calls",
      500
    );
  }

  const session = await getUserSession(request);
  const accessToken = session.get("accessToken");

  if (!accessToken) {
    throw new ApiError("Unauthorized", 401);
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...customConfig.headers,
  };

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new ApiError("API request failed", response.status);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error", 500);
  }
}

async function unauthenticatedApiClient(
  endpoint: string,
  customConfig: Omit<RequestInit, "headers"> & { headers?: HeadersInit } = {}
) {
  const headers = {
    "Content-Type": "application/json",
    ...customConfig.headers,
  };

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error", 500);
  }
}

export { apiClient, unauthenticatedApiClient, ApiError };
export type { ApiClientError };
