import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.cookie("accessToken", result.accessToken, cookieOptions);
  res.cookie("refreshToken", result.refreshToken, cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.cookie("accessToken", result.accessToken, cookieOptions);
  res.cookie("refreshToken", result.refreshToken, cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged in successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const result = await authService.refreshToken(token);
  res.cookie("accessToken", result.accessToken, cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token refreshed successfully",
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  await authService.logout(token);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged out successfully",
    data: null,
  });
});

export const authController = {
  register,
  login,
  refreshToken,
  logout,
};
