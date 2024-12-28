import { getUserSession, commitSession } from "@/lib/sessions";
import { verifyJwtToken } from "./verify-token";
import { refreshAccessToken } from "@/routes/_auth/actions";
import { API_BASE_URL } from "./env.server";

export interface UserInfo {
  userId: string;
  email: string;
  name: string;
}

interface AuthStrategy {
  verifyToken(accessToken: string): Promise<boolean>;
  refreshToken(refreshToken: string): Promise<{ access: string }>;
  getUserInfo(accessToken: string): Promise<UserInfo>;
}

class GoogleAuthStrategy implements AuthStrategy {
  async verifyToken(accessToken: string): Promise<boolean> {
    // Always resolve to true for now
    return true;
  }

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    // Implement Google-specific token refresh logic if needed
    throw new Error("Google token refresh not implemented");
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return {
      userId: data.id,
      email: data.email,
      name: data.name,
    };
  }
}

class CustomAuthStrategy implements AuthStrategy {
  async verifyToken(accessToken: string): Promise<boolean> {
    return await verifyJwtToken(accessToken);
  }

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await refreshAccessToken({ refresh: refreshToken });
    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }
    return await response.json();
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/users/userinfo/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return {
      userId: data.id,
      email: data.email,
      name: data.username,
    };
  }
}

const authStrategies: { [key: string]: AuthStrategy } = {
  google: new GoogleAuthStrategy(),
  custom: new CustomAuthStrategy(),
};

export async function requireAuth(request: Request): Promise<Request> {
  const session = await getUserSession(request);

  if (!session) {
    return request;
  }

  const authType = session.get("authType");

  if (!authType) {
    return request;
  }

  let accessToken = session.get("accessToken");

  if (!accessToken) {
    return request;
  }

  const strategy = authStrategies[authType];
  if (!strategy) {
    throw new Error(`No strategy found for auth type: ${authType}`);
  }

  const isAccessTokenValid = await strategy.verifyToken(accessToken);

  if (!isAccessTokenValid) {
    const refreshToken = session.get("refreshToken");

    if (!refreshToken) {
      return request;
    }

    try {
      const newTokens = await strategy.refreshToken(refreshToken);
      accessToken = newTokens.access;

      session.unset("accessToken");
      session.set("accessToken", accessToken);
    } catch (error) {
      console.error("Failed to refresh access token", error);
      return request;
    }
  }

  let userInfo = session.get("userInfo");
  if (!userInfo) {
    userInfo = await strategy.getUserInfo(accessToken);
    session.set("userInfo", userInfo);
  }

  request.headers.set("Set-Cookie", await commitSession(session));
  return request;
}
