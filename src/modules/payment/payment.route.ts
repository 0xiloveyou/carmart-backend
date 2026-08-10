import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.get("/:orderId", auth(), paymentController.getPaymentByOrderId);

export const paymentRoutes = router;
