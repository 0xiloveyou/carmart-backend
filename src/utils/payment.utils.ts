import Stripe from "stripe";
import { CarStatus, OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const handlePaymentSucceeded = async (paymentIntent: Stripe.PaymentIntent) => {
  const payment = await prisma.payment.findUnique({
    where: {
      stripePaymentIntentId: paymentIntent.id,
    },
    include: {
      order: true,
    },
  });

  if (!payment || payment.status === PaymentStatus.SUCCEEDED) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCEEDED,
        paidAt: new Date(),
      },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        status: OrderStatus.PAID,
      },
    });

    await tx.car.update({
      where: { id: payment.order.carId },
      data: {
        status: CarStatus.SOLD,
      },
    });
  });
};

export const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  const payment = await prisma.payment.findUnique({
    where: {
      stripePaymentIntentId: paymentIntent.id,
    },
    include: {
      order: true,
    },
  });

  if (!payment || payment.status === PaymentStatus.SUCCEEDED) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
      },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    await tx.car.update({
      where: { id: payment.order.carId },
      data: {
        status: CarStatus.AVAILABLE,
      },
    });
  });
};
