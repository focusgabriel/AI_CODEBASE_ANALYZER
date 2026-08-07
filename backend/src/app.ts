import express from "express";
import cors from "cors";

import { env } from "./core/config/env.js";
import { errorHandler } from "./core/middlewares/errorHandler.js";
import analysisRoutes from "./routes/analysis.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(errorHandler);
app.use("/api/v1/analyses", analysisRoutes);
app.use("/api/v1/reports", reportRoutes);
// app.use("/api/v1/analyses/:upload", uploadRoutes)

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running.",
  });
});

export default app;
