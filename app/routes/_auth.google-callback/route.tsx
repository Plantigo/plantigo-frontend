import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { commitSession, createUserSession } from "@/lib/sessions";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} from "@/lib/env.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return redirect("/login");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return redirect("/login");
  }

  const tokenData = await tokenResponse.json();

  const accessToken = tokenData.access_token;

  const session = await createUserSession({
    accessToken,
    refreshToken: tokenData.refresh_token,
    authType: "google",
  });

  return redirect("/app", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
