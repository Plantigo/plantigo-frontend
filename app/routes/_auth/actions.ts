import { API_BASE_URL } from "@/lib/env.server";

export async function login(data: Record<string, string>) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  return response;
}

export async function refreshAccessToken(data: Record<string, string>) {
  return await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: data.refresh,
    }),
  });
}
