import { type MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { deviceActions } from "@/actions/devices";
import Dashboard from "./dashboard";

export const meta: MetaFunction = () => {
  return [
    { title: "Plantigo" },
    { name: "description", content: "Welcome to Plantigo!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const data = await deviceActions.getAll(request);
    return data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
}

export default function DashboardRoute() {
  return <Dashboard />;
}
