import { Router } from "express";
import { getMetricsByAnalysisController, getUserMetricsController } from "../controllers/metrics.controller.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.get("/:analysisId", authMiddleware, getMetricsByAnalysisController);
router.get(
  "/",
  authMiddleware,
  getUserMetricsController,
);

export default router;