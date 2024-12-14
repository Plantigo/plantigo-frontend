import { redirect } from "@remix-run/node";
import { tokenCookie } from "../_auth/cookies.server";

export async function action() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await tokenCookie.serialize("", { maxAge: 0 }),
    },
  });
}
