import { createCookieSessionStorage } from "@remix-run/node";
import * as env from "@/lib/env.server";
import { verifyJwtToken } from "./verify-token";
import { refreshAccessToken } from "@/routes/_auth/actions";

const { getSession, commitSession, destroySession } =
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
  refreshToken: string,
  redirectTo: string
) {
  const session = await getSession();
  session.set("accessToken", accessToken);
  session.set("refreshToken", refreshToken);
  return {
    headers: {
      "Set-Cookie": await commitSession(session),
      Location: redirectTo,
    },
    status: 302,
  };
}

export async function getUserSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return getSession(cookie);
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
      Location: "/",
    },
    status: 302,
  };
}

export async function requireAuth(request: Request) {
  const session = await getUserSession(request);
  let accessToken = session.get("accessToken");

  const isAccessTokenValid = await verifyJwtToken(accessToken);

  // Jeśli access token jest nieważny
  if (!isAccessTokenValid) {
    const refreshToken = session.get("refreshToken");

    if (!refreshToken) {
      return await logout(request);
    }

    try {
      const response = await refreshAccessToken({
        refresh: refreshToken,
      });
      const newTokens = await response.json();
      accessToken = newTokens.access;

      session.set("accessToken", accessToken);
    } catch (error) {
      console.error("Failed to refresh access token", error);
      return await logout(request);
    }
  }

  return { accessToken };
}
