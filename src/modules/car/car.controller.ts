import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getUser, requiredParam } from "../../utils/parse";
import { sendResponse } from "../../utils/sendResponse";
import { carService } from "./car.service";

const createCar = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await carService.createCar(user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Car created successfully",
    data: result,
  });
});

const getCars = catchAsync(async (req: Request, res: Response) => {
  const result = await carService.getCars(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cars retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getCarById = catchAsync(async (req: Request, res: Response) => {
  const result = await carService.getCarById(requiredParam(req.params.id, "id"));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Car retrieved successfully",
    data: result,
  });
});

const updateCar = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await carService.updateCar(requiredParam(req.params.id, "id"), user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Car updated successfully",
    data: result,
  });
});

const deleteCar = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await carService.deleteCar(requiredParam(req.params.id, "id"), user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Car deleted successfully",
    data: result,
  });
});

export const carController = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};
