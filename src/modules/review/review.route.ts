import { Router } from "express";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router({ mergeParams: true });

router.get("/", reviewController.getReviewsByCar);
router.post("/", auth(UserRole.CUSTOMER), reviewController.createReview);

export const reviewRoutes = router;
