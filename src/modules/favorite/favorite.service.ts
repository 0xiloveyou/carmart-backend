import { prisma } from "../../lib/prisma";

const getFavorites = async (userId: string) => {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      car: {
        include: {
          images: true,
          seller: { select: { id: true, email: true, profile: true } },
        },
      },
    },
  });
};

const addFavorite = async (userId: string, carId: string) => {
  return prisma.favorite.upsert({
    where: {
      userId_carId: { userId, carId },
    },
    create: {
      userId,
      carId,
    },
    update: {},
    include: {
      car: {
        include: {
          images: true,
        },
      },
    },
  });
};

const removeFavorite = async (userId: string, carId: string) => {
  await prisma.favorite.deleteMany({
    where: {
      userId,
      carId,
    },
  });
  return null;
};

export const favoriteService = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
