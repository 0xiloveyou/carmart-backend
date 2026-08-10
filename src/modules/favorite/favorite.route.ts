import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { favoriteController } from "./favorite.controller";

const router = Router();

router.get("/", auth(), favoriteController.getFavorites);
router.post("/:carId", auth(), favoriteController.addFavorite);
router.delete("/:carId", auth(), favoriteController.removeFavorite);

export const favoriteRoutes = router;
