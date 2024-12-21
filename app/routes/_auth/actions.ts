import { API_BASE_URL } from "@/lib/env.server";

export async function login(data: Record<string, string>) {
  try {
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
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function refreshAccessToken(data: Record<string, string>) {
  try {
    return await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: data.refresh,
      }),
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function registerUser(data: Record<string, string>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
      }),
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
