import { getUserSession } from "@/lib/sessions";
import jwt from "jsonwebtoken";

export interface UserInfo {
  userId: string;
  email: string;
  name: string;
  iss?: string;
}

export async function getUser(
  request: Request | null
): Promise<UserInfo | null> {
  if (!request) {
    return null;
  }

  try {
    const session = await getUserSession(request);
    const accessToken = session.get("accessToken");
    const userInfo = session.get("userInfo");

    if (userInfo && (userInfo.iss as string).includes("accounts.google.com")) {
      return userInfo as UserInfo;
    }

    // Mock sending a request to the API to get user info for internal auth
    const decodedToken = jwt.decode(accessToken) as jwt.JwtPayload;
    const userId = decodedToken.user_id;

    // Mock user info
    const internalUserInfo: UserInfo = {
      userId,
      email: "user@example.com",
      name: "Internal User",
    };

    return internalUserInfo;
  } catch (error) {
    console.error("Failed to get user", error);
    return null;
  }
}
