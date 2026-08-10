import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import { requiredParam } from "../../utils/parse";

const sendAdminResponse = (res: Response, message: string, data: unknown) =>
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message,
    data,
  });

const getUsers = catchAsync(async (_req: Request, res: Response) => {
  sendAdminResponse(res, "Users retrieved successfully", await adminService.getUsers());
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  sendAdminResponse(res, "User updated successfully", await adminService.updateUser(requiredParam(req.params.id, "id"), req.body));
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  sendAdminResponse(res, "User deleted successfully", await adminService.deleteUser(requiredParam(req.params.id, "id")));
});

const getCars = catchAsync(async (_req: Request, res: Response) => {
  sendAdminResponse(res, "Cars retrieved successfully", await adminService.getCars());
});

const updateCar = catchAsync(async (req: Request, res: Response) => {
  sendAdminResponse(res, "Car updated successfully", await adminService.updateCar(requiredParam(req.params.id, "id"), req.body));
});

const deleteCar = catchAsync(async (req: Request, res: Response) => {
  sendAdminResponse(res, "Car deleted successfully", await adminService.deleteCar(requiredParam(req.params.id, "id")));
});

const getOrders = catchAsync(async (_req: Request, res: Response) => {
  sendAdminResponse(res, "Orders retrieved successfully", await adminService.getOrders());
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  sendAdminResponse(res, "Order updated successfully", await adminService.updateOrder(requiredParam(req.params.id, "id"), req.body));
});

const getPayments = catchAsync(async (_req: Request, res: Response) => {
  sendAdminResponse(res, "Payments retrieved successfully", await adminService.getPayments());
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  sendAdminResponse(res, "Review deleted successfully", await adminService.deleteReview(requiredParam(req.params.id, "id")));
});

export const adminController = {
  getUsers,
  updateUser,
  deleteUser,
  getCars,
  updateCar,
  deleteCar,
  getOrders,
  updateOrder,
  getPayments,
  deleteReview,
};
