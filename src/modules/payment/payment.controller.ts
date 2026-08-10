import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getUser, requiredParam } from "../../utils/parse";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const getPaymentByOrderId = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await paymentService.getPaymentByOrderId(requiredParam(req.params.orderId, "orderId"), user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.handleStripeWebhook(req.headers["stripe-signature"], req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Stripe webhook processed successfully",
    data: result,
  });
});

export const paymentController = {
  getPaymentByOrderId,
  handleStripeWebhook,
};
