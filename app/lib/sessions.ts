import { createCookieSessionStorage } from "@remix-run/node";
import * as env from "@/lib/env.server";
import { verifyJwtToken } from "./verify-token";
import { refreshAccessToken } from "@/routes/_auth/actions";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      secure: process.env.NODE_ENV === "production",
      secrets: [env.SESSION_SECRET!],
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  });

export async function createUserSession(
  accessToken: string,
  refreshToken: string
) {
  const session = await getSession();
  session.set("accessToken", accessToken);
  session.set("refreshToken", refreshToken);
  return session;
}

export async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return await getSession(cookie);
}

export async function getUserToken(request: Request) {
  const session = await getUserSession(request);
  return session.get("jwt");
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return {
    headers: {
      "Set-Cookie": await destroySession(session),
      Location: "/login",
    },
    status: 302,
  };
}

export async function requireAuth(request: Request) {
  const session = await getUserSession(request);

  let accessToken = session.get("accessToken");

  if (!accessToken) {
    return null;
  }

  const userInfo = session.get("userInfo");
  if (userInfo && (userInfo.iss as string).includes("accounts.google.com")) {
    return request;
  }

  const isAccessTokenValid = await verifyJwtToken(accessToken);

  if (!isAccessTokenValid) {
    const refreshToken = session.get("refreshToken");

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await refreshAccessToken({ refresh: refreshToken });
      if (!response.ok) {
        return null;
      }

      const newTokens = await response.json();
      accessToken = newTokens.access;

      session.unset("accessToken");
      session.set("accessToken", accessToken);
      request.headers.set("Set-Cookie", await commitSession(session));
    } catch (error) {
      console.error("Failed to refresh access token", error);
      return null;
    }
  }

  return request;
}
