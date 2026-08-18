import { Router } from "express";
import { getCodebaseExplorerController, getMetricsByAnalysisController, getUserMetricsController } from "../controllers/metrics.controller.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.get("/:analysisId", authMiddleware, getMetricsByAnalysisController);
router.get(
  "/",
  authMiddleware,
  getUserMetricsController,
);

router.get(
  "/analyses/:analysisId/explorer",
  authMiddleware,
  getCodebaseExplorerController,
);
export default router;