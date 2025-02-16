import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authActions } from "@/actions/auth";

export async function action({ request }: ActionFunctionArgs) {
  const { headers } = await authActions.logout(request);
  return redirect("/login", { headers });
}
