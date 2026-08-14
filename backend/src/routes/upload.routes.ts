import { Router } from "express";

import { createAnalysisController } from "../controllers/analysis.controller.js";
import { getUploadByUserController, getUploadRecordController, uploadRepositoryController } from "../controllers/upload.controller.js";
import { upload } from "../config/multer.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

// router.post("/", authMiddleware, createAnalysisController);

router.post(
  "/:analysisId/upload",
  upload.single("repository"),
  authMiddleware,
  uploadRepositoryController,
);

router.get("/:uploadId/:analysisId", authMiddleware, getUploadRecordController);
router.get("/", authMiddleware, getUploadByUserController)

export default router;
