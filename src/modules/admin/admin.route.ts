import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.use(auth(UserRole.ADMIN));

router.get("/users", adminController.getUsers);
router.patch("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/cars", adminController.getCars);
router.patch("/cars/:id", adminController.updateCar);
router.delete("/cars/:id", adminController.deleteCar);

router.get("/orders", adminController.getOrders);
router.patch("/orders/:id", adminController.updateOrder);

router.get("/payments", adminController.getPayments);
router.delete("/reviews/:id", adminController.deleteReview);

export const adminRoutes = router;
