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

app.use("/api/v1/users", userRouter);

export default app;
