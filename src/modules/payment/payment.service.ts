import httpStatus from "http-status";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { AppError, throwError } from "../../utils/appError";
import { handlePaymentFailed, handlePaymentSucceeded } from "../../utils/payment.utils";

const getPaymentByOrderId = async (orderId: string, user: { id: string; role: string }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (user.role !== "ADMIN" && order.customerId !== user.id && order.sellerId !== user.id) {
    throwError(httpStatus.FORBIDDEN, "You cannot access this payment");
  }

  return order.payment;
};

const handleStripeWebhook = async (signature: string | string[] | undefined, body: Buffer) => {
  if (!signature) {
    throwError(httpStatus.BAD_REQUEST, "Stripe signature is missing");
  }

  const event = stripe.webhooks.constructEvent(body, signature as string | Buffer | string[], config.stripe_webhook_secret);

  if (event.type === "payment_intent.succeeded") {
    await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
  }

  if (event.type === "payment_intent.payment_failed" || event.type === "payment_intent.canceled") {
    await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
  }

  return { received: true, type: event.type };
};

export const paymentService = {
  getPaymentByOrderId,
  handleStripeWebhook,
};
