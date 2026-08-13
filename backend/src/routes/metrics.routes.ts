import { Router } from "express";
import { getMetricsByAnalysisController } from "../controllers/metrics.controller.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.get("/:analysisId", authMiddleware, getMetricsByAnalysisController);

export default router;