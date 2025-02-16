import { unauthenticatedApiClient } from "@/lib/api-client";
import { getUserSession, destroySession } from "@/lib/sessions";

export const authActions = {
  login: async (data: Record<string, string>) => {
    try {
      const response = await unauthenticatedApiClient("/api/v1/auth/token/", {
        method: "POST",
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
  },

  refreshAccessToken: async (data: Record<string, string>) => {
    try {
      const response = await unauthenticatedApiClient(
        "/api/v1/auth/token/refresh/",
        {
          method: "POST",
          body: JSON.stringify({
            refresh: data.refresh,
          }),
        }
      );

      return response;
    } catch (error) {
      console.error("Refresh token error:", error);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
      });
    }
  },

  register: async (data: Record<string, string>) => {
    try {
      const response = await unauthenticatedApiClient(
        "/api/v1/auth/register/",
        {
          method: "POST",
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            confirm_password: data.confirmPassword,
          }),
        }
      );

      return response;
    } catch (error) {
      console.error("Register error:", error);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
      });
    }
  },

  logout: async (request: Request) => {
    const session = await getUserSession(request);
    return {
      headers: {
        "Set-Cookie": await destroySession(session),
        Location: "/login",
      },
      status: 302,
    };
  },
};
