import { tokenCookie } from "@/routes/_auth/cookies.server";
import { verifyJwtToken } from "./verify-token";
import { refreshAccessToken } from "@/routes/_auth/actions";

export async function getUser(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookie = (await tokenCookie.parse(cookieHeader)) || {};
  console.log("cookie from header", cookie);

  if (!cookie.access || !cookie.refresh) return null;

  let userId;

  try {
    userId = await verifyJwtToken(cookie.access);
  } catch (err) {
    if (err === "TokenExpiredError" && cookie.refresh) {
      const response = await refreshAccessToken({ refresh: cookie.refresh });

      if (!response.ok) {
        console.error(
          "Failed to refresh token",
          response.status,
          response.statusText
        );
        request.headers.set(
          "Set-Cookie",
          await tokenCookie.serialize("", { maxAge: 0 })
        );
        return null;
      }

      const { access: newAccessToken } = await response.json();
      userId = await verifyJwtToken(newAccessToken);
      request.headers.set(
        "Set-Cookie",
        await tokenCookie.serialize({
          access: newAccessToken,
          refresh: cookie.refresh,
        })
      );
    } else {
      console.error("Failed to verify token", err);
      request.headers.set(
        "Set-Cookie",
        await tokenCookie.serialize("", { maxAge: 0 })
      );
      return null;
    }
  }

  return {
    userId,
    request,
  };
}
