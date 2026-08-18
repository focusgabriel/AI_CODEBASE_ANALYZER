import { Router } from "express";
import { getAnalysisFileController, getAnalysisFilesController, getFileMetricsController } from "../controllers/file.controller.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.get("/:analysisId", authMiddleware, getAnalysisFilesController);

router.get(
  "/analyses/:analysisId/files/:fileId/metrics",
  authMiddleware,
  getFileMetricsController,
);

router.get(
  "/analyses/:analysisId/files/:fileId",
  authMiddleware,
  getAnalysisFileController,
);

export default router;
