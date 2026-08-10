import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { userController } from "./user.controller";

const router = Router();

router.get("/me", auth(), userController.getMe);
router.patch("/me", auth(), userController.updateMe);
router.patch("/me/profile", auth(), userController.updateProfile);

export const userRoutes = router;
