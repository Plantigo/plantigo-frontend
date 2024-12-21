import { useLoaderData } from "@remix-run/react";

interface UserLoaderData {
  userId: string | null;
}

export function useUserData(): UserLoaderData {
  const loaderData = useLoaderData() as UserLoaderData | string;
  const parsedData =
    typeof loaderData === "string" ? JSON.parse(loaderData) : loaderData;
  return { userId: parsedData.userId ?? null };
}
