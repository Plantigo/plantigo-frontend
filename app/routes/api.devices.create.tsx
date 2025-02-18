import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { deviceActions } from "@/actions/devices";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    await deviceActions.create(request, {
      name: formData.get("name") as string,
      mac_address: formData.get("mac_address") as string,
      plant_name: formData.get("plant_name") as string,
      is_active: true,
    });
    return redirect("/setup-device/success");
  } catch (error) {
    console.error("Failed to create device:", error);
    return json({ error: "Failed to create device" }, { status: 500 });
  }
}
