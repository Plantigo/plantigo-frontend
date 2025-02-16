import { createCookieSessionStorage } from "@remix-run/node";
import * as env from "@/lib/env.server";

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

export async function createUserSession({
  accessToken,
  refreshToken,
  authType,
}: {
  accessToken: string;
  refreshToken: string;
  authType: string;
}) {
  const session = await getSession();
  session.set("accessToken", accessToken);
  session.set("refreshToken", refreshToken);
  session.set("authType", authType);
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
