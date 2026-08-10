import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { carRoutes } from "./modules/car/car.route";
import { orderRoutes } from "./modules/order/order.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { favoriteRoutes } from "./modules/favorite/favorite.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { webhookRoutes } from "./modules/webhook/webhook.route";


const app : Application = express()

const allowedOrigins = [
  "http://localhost:3000",
  "https://carmart-frontend.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
 

app.use(
  "/api/v1/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes
);


app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.get("/", async (req : Request, res: Response) => {
   res.send("Welcome to Car Mart.");
 })

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(notFound)
app.use(globalErrorHandler)

export default app;
