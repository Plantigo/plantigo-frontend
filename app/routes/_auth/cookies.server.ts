import { createCookie } from "@remix-run/node";

export const tokenCookie = createCookie("accessToken", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 dni
});
