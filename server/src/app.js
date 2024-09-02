import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config("./.env");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "20kb", extended: true }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import porductRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", porductRouter);
app.use("/api/v1/cart", cartRouter);

export default app;
