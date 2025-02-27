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
  let accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");
  const authType = session.get("authType");

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
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle token expiration
    if (response.status === 403 && refreshToken && authType) {
      try {
        // Try to refresh the token
        const refreshResponse = await unauthenticatedApiClient(
          "/api/v1/auth/token/refresh/",
          {
            method: "POST",
            body: JSON.stringify({ refresh: refreshToken }),
          }
        );

        if (!refreshResponse.ok) {
          throw new ApiError("Failed to refresh token", refreshResponse.status);
        }

        const { access } = await refreshResponse.json();

        // Update session with new access token
        session.unset("accessToken");
        session.set("accessToken", access);

        // Retry the original request with new token
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${access}`,
        };

        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...config,
          headers: newHeaders,
        });
      } catch (error) {
        throw new ApiError("Token refresh failed", 403);
      }
    }

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
