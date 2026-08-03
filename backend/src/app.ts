import express from "express";
import cors from "cors";

import { env } from "./core/config/env.js";
import { errorHandler } from "./core/middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running.",
  });
});




app.use(errorHandler);

export default app;