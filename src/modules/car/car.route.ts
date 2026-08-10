import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { carController } from "./car.controller";
import { reviewRoutes } from "../review/review.route";

const router = Router();

router.get("/", carController.getCars);
router.get("/:id", carController.getCarById);
router.post("/", auth(UserRole.SELLER), carController.createCar);
router.patch("/:id", auth(UserRole.SELLER, UserRole.ADMIN), carController.updateCar);
router.delete("/:id", auth(UserRole.SELLER, UserRole.ADMIN), carController.deleteCar);
router.use("/:carId/reviews", reviewRoutes);

export const carRoutes = router;
