import { UserRole } from "@prisma/client";
import config from "../config";
import { jwtUtils } from "./jwt";

export const createAuthTokens = (user: { id: string; email: string; role: UserRole }) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: jwtUtils.createToken(payload, config.jwt_access_secret, config.jwt_access_expires_in),
    refreshToken: jwtUtils.createToken(payload, config.jwt_refresh_secret, config.jwt_refresh_expires_in),
  };
};
