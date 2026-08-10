import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { AppError, throwError } from "../../utils/appError";
import { createAuthTokens } from "../../utils/tokens";
import { jwtUtils } from "../../utils/jwt";
import { validateLogin, validateRegister } from "./auth.validation";

const refreshExpiryDate = (token: string) => {
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === "object" && decoded.exp) {
    return new Date(decoded.exp * 1000);
  }
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};

const register = async (payload: Record<string, any>) => {
  const data = validateRegister(payload);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throwError(httpStatus.BAD_REQUEST, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, Number(config.bcrypt_salt_rounds || 10));

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role,
      profile: {
        create: data.profile,
      },
    },
    include: {
      profile: true,
    },
  });

  const tokens = createAuthTokens(user);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: refreshExpiryDate(tokens.refreshToken),
    },
  });

  const { password, ...safeUser } = user;
  return { user: safeUser, ...tokens };
};

const login = async (payload: Record<string, any>) => {
  const data = validateLogin(payload);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { profile: true },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (!(await bcrypt.compare(data.password, user.password))) {
    throwError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (!user.isActive) {
    throwError(httpStatus.FORBIDDEN, "Your account is inactive");
  }

  const tokens = createAuthTokens(user);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: refreshExpiryDate(tokens.refreshToken),
    },
  });

  const { password, ...safeUser } = user;
  return { user: safeUser, ...tokens };
};

const refreshToken = async (token?: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }

  const verified = jwtUtils.verifyToken(token, config.jwt_refresh_secret);
  if (!verified.success) {
    throwError(httpStatus.UNAUTHORIZED, verified.error || "Refresh token is invalid");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is invalid or expired");
  }

  if (storedToken.expiresAt < new Date()) {
    throwError(httpStatus.UNAUTHORIZED, "Refresh token is invalid or expired");
  }

  if (!storedToken.user.isActive) {
    throwError(httpStatus.FORBIDDEN, "Your account is inactive");
  }

  const accessToken = jwtUtils.createToken(
    {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    },
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return { accessToken };
};

const logout = async (token?: string) => {
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
  return null;
};

export const authService = {
  register,
  login,
  refreshToken,
  logout,
};
