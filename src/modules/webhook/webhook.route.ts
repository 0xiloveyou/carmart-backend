import { Router } from "express";
import { paymentController } from "../payment/payment.controller";

const router = Router();

router.post("/stripe", paymentController.handleStripeWebhook);

export const webhookRoutes = router;
