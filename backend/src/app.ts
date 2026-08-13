import express, { Application } from "express";
import cors from "cors";

import { env } from "./core/config/env.js";
import { errorHandler } from "./core/middlewares/errorHandler.js";
import analysisRoutes from "./routes/analysis.routes.js";
import reportRoutes from "./routes/report.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

console.log("localhost:", env.CLIENT_URL)
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser());

app.use("/api/v1/analyses", analysisRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1", authRoutes);
// app.use("/api/v1/analyses/:upload", uploadRoutes)
app.use(errorHandler);

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running.",
  });
});

export default app;
