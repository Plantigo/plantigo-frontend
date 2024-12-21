import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "@/lib/sessions";

export async function action({ request }: ActionFunctionArgs) {
  const { headers } = await logout(request);
  return redirect("/", { headers });
}
