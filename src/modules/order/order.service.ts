import httpStatus from "http-status";
import { CarStatus, OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError, throwError } from "../../utils/appError";

const orderInclude = {
  car: { include: { images: true, seller: { select: { id: true, email: true, profile: true } } } },
  customer: { select: { id: true, email: true, profile: true } },
  seller: { select: { id: true, email: true, profile: true } },
  payment: true,
};

const createOrder = async (customerId: string, payload: Record<string, any>) => {
  if (!payload.carId) {
    throwError(httpStatus.BAD_REQUEST, "carId is required");
  }

  const order = await prisma.$transaction(async (tx) => {
    const car = await tx.car.findUnique({ where: { id: String(payload.carId) } });
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, "Car not found");
    }

    if (car.sellerId === customerId) {
      throwError(httpStatus.BAD_REQUEST, "You cannot buy your own car");
    }

    const reserved = await tx.car.updateMany({
      where: { id: car.id, status: CarStatus.AVAILABLE },
      data: { status: CarStatus.PENDING },
    });

    if (reserved.count !== 1) {
      throwError(httpStatus.CONFLICT, "Car is not available for purchase");
    }

    return tx.order.create({
      data: {
        carId: car.id,
        customerId,
        sellerId: car.sellerId,
        amount: car.price,
      },
      include: orderInclude,
    });
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.amount) * 100),
      currency: String(payload.currency || "usd").toLowerCase(),
      metadata: {
        orderId: order.id,
        carId: order.carId,
        customerId,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: order.amount,
        currency: paymentIntent.currency,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      ...order,
      payment,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    await prisma.$transaction([
      prisma.order.delete({ where: { id: order.id } }),
      prisma.car.update({ where: { id: order.carId }, data: { status: CarStatus.AVAILABLE } }),
    ]);
    throw error;
  }
};

const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });
};

const getOrderById = async (orderId: string, user: { id: string; role: string }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (user.role !== "ADMIN" && order.customerId !== user.id && order.sellerId !== user.id) {
    throwError(httpStatus.FORBIDDEN, "You cannot access this order");
  }

  return order;
};

const cancelOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.customerId !== userId) {
    throwError(httpStatus.FORBIDDEN, "You can only cancel your own orders");
  }

  if (order.status !== OrderStatus.PENDING) {
    throwError(httpStatus.BAD_REQUEST, "Only pending orders can be cancelled");
  }

  return prisma.$transaction(async (tx) => {
    await tx.car.update({ where: { id: order.carId }, data: { status: CarStatus.AVAILABLE } });
    return tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.CANCELLED },
      include: orderInclude,
    });
  });
};

export const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
