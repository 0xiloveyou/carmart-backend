import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { orderController } from "./order.controller";

const router = Router();

router.post("/", auth(UserRole.CUSTOMER), orderController.createOrder);
router.get("/my-orders", auth(), orderController.getMyOrders);
router.get("/:id", auth(), orderController.getOrderById);
router.patch("/:id/cancel", auth(UserRole.CUSTOMER), orderController.cancelOrder);

export const orderRoutes = router;
