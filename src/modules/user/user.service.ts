import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { pick } from "../../utils/parse";
import { throwError } from "../../utils/appError";

const profileFields = ["firstName", "lastName", "phone", "avatar", "address", "city", "country"];

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
    omit: { password: true },
  });

  if (!user) {
    throwError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateMe = async (userId: string, payload: Record<string, any>) => {
  const allowed = pick(payload, ["email"]);

  if (allowed.email) {
    allowed.email = String(allowed.email).toLowerCase().trim();
  }

  return prisma.user.update({
    where: { id: userId },
    data: allowed,
    include: { profile: true },
    omit: { password: true },
  });
};

const updateProfile = async (userId: string, payload: Record<string, any>) => {
  const data = pick(payload, profileFields);

  return prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  });
};

export const userService = {
  getMe,
  updateMe,
  updateProfile,
};
