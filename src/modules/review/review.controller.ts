import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getUser, requiredParam } from "../../utils/parse";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const getReviewsByCar = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getReviewsByCar(requiredParam(req.params.carId, "carId"));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await reviewService.createReview(requiredParam(req.params.carId, "carId"), user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

export const reviewController = {
  getReviewsByCar,
  createReview,
};
