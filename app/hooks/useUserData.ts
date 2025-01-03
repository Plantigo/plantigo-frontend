import { UserInfo } from "@/lib/require-auth.server";
import { useLoaderData } from "@remix-run/react";

interface UserLoaderData {
  user: UserInfo | null;
}

export function useUserData(): UserLoaderData {
  const loaderData = useLoaderData<string>();
  const parsedData =
    typeof loaderData === "string" ? JSON.parse(loaderData) : loaderData;
  return { user: parsedData };
}
