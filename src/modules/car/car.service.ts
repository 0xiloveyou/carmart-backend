import httpStatus from "http-status";
import { CarCondition, CarStatus, FuelType, Prisma, Transmission, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { numberFromQuery } from "../../utils/parse";
import { AppError, throwError } from "../../utils/appError";
import { validateCarCreate, validateCarUpdate } from "./car.validation";

const carInclude = {
  seller: {
    select: {
      id: true,
      email: true,
      role: true,
      profile: true,
    },
  },
  images: true,
  reviews: true,
};

const createCar = async (sellerId: string, payload: Record<string, any>) => {
  const data = validateCarCreate(payload);

  return prisma.car.create({
    data: {
      sellerId,
      brand: data.brand,
      model: data.model,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      fuelType: data.fuelType,
      transmission: data.transmission,
      condition: data.condition,
      description: data.description,
      images: {
        create: data.images.map((image: any) => ({
          url: String(image.url ?? image),
          publicId: image.publicId ? String(image.publicId) : undefined,
        })),
      },
    },
    include: carInclude,
  });
};

const getCars = async (query: Record<string, any>) => {
  const page = numberFromQuery(query.page) || 1;
  const limit = numberFromQuery(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.CarWhereInput = {
    status: (query.status as CarStatus) || CarStatus.AVAILABLE,
  };

  if (query.brand) where.brand = { contains: String(query.brand), mode: "insensitive" };
  if (query.model) where.model = { contains: String(query.model), mode: "insensitive" };
  if (query.year) where.year = Number(query.year);
  if (query.fuelType) where.fuelType = query.fuelType as FuelType;
  if (query.transmission) where.transmission = query.transmission as Transmission;
  if (query.condition) where.condition = query.condition as CarCondition;

  const minPrice = numberFromQuery(query.minPrice);
  const maxPrice = numberFromQuery(query.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  }

  const [data, total] = await Promise.all([
    prisma.car.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: carInclude,
    }),
    prisma.car.count({ where }),
  ]);

  return {
    data: data.map((car) => ({
      ...car,
      averageRating: car.reviews.length
        ? car.reviews.reduce((totalRating, review) => totalRating + review.rating, 0) / car.reviews.length
        : 0,
      reviewCount: car.reviews.length,
    })),
    meta: { page, limit, total },
  };
};

const getCarById = async (id: string) => {
  const car = await prisma.car.findUnique({
    where: { id },
    include: carInclude,
  });

  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  return {
    ...car,
    averageRating: car.reviews.length
      ? car.reviews.reduce((totalRating, review) => totalRating + review.rating, 0) / car.reviews.length
      : 0,
    reviewCount: car.reviews.length,
  };
};

const updateCar = async (id: string, user: { id: string; role: UserRole }, payload: Record<string, any>) => {
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  if (user.role !== UserRole.ADMIN && car.sellerId !== user.id) {
    throwError(httpStatus.FORBIDDEN, "You can only update your own cars");
  }

  const data = validateCarUpdate(payload);
  const images = data.images;
  delete data.images;

  return prisma.$transaction(async (tx) => {
    if (images) {
      await tx.carImage.deleteMany({ where: { carId: id } });
      await tx.carImage.createMany({
        data: images.map((image: any) => ({
          carId: id,
          url: String(image.url ?? image),
          publicId: image.publicId ? String(image.publicId) : undefined,
        })),
      });
    }

    return tx.car.update({
      where: { id },
      data,
      include: carInclude,
    });
  });
};

const deleteCar = async (id: string, user: { id: string; role: UserRole }) => {
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  if (user.role !== UserRole.ADMIN && car.sellerId !== user.id) {
    throwError(httpStatus.FORBIDDEN, "You can only delete your own cars");
  }

  await prisma.car.delete({ where: { id } });
  return null;
};

export const carService = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};
