import { getUserSession } from "@/lib/sessions";
import { UserInfo } from "./require-auth.server";

export async function getUser(
  request: Request | null
): Promise<UserInfo | null> {
  if (!request) {
    return null;
  }

  try {
    const session = await getUserSession(request);
    const userInfo = session.get("userInfo");

    if (!userInfo) {
      return null;
    }

    return userInfo;
  } catch (error) {
    console.error("Failed to get user", error);
    return null;
  }
}
