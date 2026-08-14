import { Router } from "express";
import { getAllMetricsController, getMetricsByAnalysisController } from "../controllers/metrics.controller.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.get("/:analysisId", authMiddleware, getMetricsByAnalysisController);
router.get("/", authMiddleware, getAllMetricsController);

export default router;