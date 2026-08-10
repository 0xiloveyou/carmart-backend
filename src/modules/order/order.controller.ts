import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getUser, requiredParam } from "../../utils/parse";
import { sendResponse } from "../../utils/sendResponse";
import { orderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await orderService.createOrder(user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order created successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await orderService.getMyOrders(user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await orderService.getOrderById(requiredParam(req.params.id, "id"), user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await orderService.cancelOrder(requiredParam(req.params.id, "id"), user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order cancelled successfully",
    data: result,
  });
});

export const orderController = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
