import { Router } from "express";

import { createAnalysisController } from "../controllers/analysis.controller.js";
import { uploadRepositoryController } from "../controllers/upload.controller.js";
import { upload } from "../config/multer.js";

const router = Router();

router.post("/", createAnalysisController);

router.post(
  "/:analysisId/upload",
  upload.single("repository"),
  uploadRepositoryController,
);

export default router;
