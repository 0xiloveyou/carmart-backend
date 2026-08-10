import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getUser, requiredParam } from "../../utils/parse";
import { sendResponse } from "../../utils/sendResponse";
import { favoriteService } from "./favorite.service";

const getFavorites = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await favoriteService.getFavorites(user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Favorites retrieved successfully",
    data: result,
  });
});

const addFavorite = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await favoriteService.addFavorite(user.id, requiredParam(req.params.carId, "carId"));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Favorite saved successfully",
    data: result,
  });
});

const removeFavorite = catchAsync(async (req: Request, res: Response) => {
  const user = getUser(req);
  const result = await favoriteService.removeFavorite(user.id, requiredParam(req.params.carId, "carId"));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Favorite removed successfully",
    data: result,
  });
});

export const favoriteController = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
