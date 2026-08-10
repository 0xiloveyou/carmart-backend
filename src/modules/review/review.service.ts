import httpStatus from "http-status";
import { OrderStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError, throwError } from "../../utils/appError";

const getReviewsByCar = async (carId: string) => {
  return prisma.review.findMany({
    where: { carId },
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });
};

const createReview = async (carId: string, customerId: string, payload: Record<string, any>) => {
  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throwError(httpStatus.BAD_REQUEST, "Rating must be an integer from 1 to 5");
  }

  const order = await prisma.order.findFirst({
    where: {
      carId,
      customerId,
      status: { in: [OrderStatus.PAID, OrderStatus.COMPLETED] },
    },
    include: {
      review: true,
    },
  });

  if (!order) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only review cars you have purchased");
  }

  if (order.review) {
    throwError(httpStatus.BAD_REQUEST, "This order already has a review");
  }

  return prisma.review.create({
    data: {
      carId,
      customerId,
      orderId: order.id,
      rating,
      comment: payload.comment ? String(payload.comment) : undefined,
    },
  });
};

export const reviewService = {
  getReviewsByCar,
  createReview,
};
