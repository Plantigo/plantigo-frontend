import jwt from "jsonwebtoken";
import * as env from "./env.server";

export function verifyJwtToken(token: string): Promise<boolean> {
  const secretKey = env.JWT_SECRET;

  if (!secretKey) {
    console.error("JWT_SECRET is not defined");
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        if (err.message === "jwt expired") {
          console.warn("Token has expired");
        } else {
          console.warn("Invalid token");
        }
        resolve(false);
      } else if (decoded && (decoded as jwt.JwtPayload).user_id) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
