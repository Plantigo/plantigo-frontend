import { getUserSession } from "@/lib/sessions";
import jwt from "jsonwebtoken";

export async function getUser(request: Request | null) {
  if (!request) {
    return null;
  }

  try {
    const session = await getUserSession(request);
    const accessToken = session.get("accessToken");
    const decodedToken = jwt.decode(accessToken) as jwt.JwtPayload;
    const userId = decodedToken.user_id;

    return { userId };
  } catch (error) {
    console.error("Failed to get user", error);
    return null;
  }
}
