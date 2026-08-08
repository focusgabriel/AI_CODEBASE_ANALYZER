// import { Router } from "express";
// import { AnalysisController } from "../controllers/analysis.controller.js";

// const router = Router();

// const analysisController = new AnalysisController();

// router.post("/", analysisController.createAnalysis.bind(analysisController));

// export default router;

import { Router } from "express";
import { upload } from "../config/multer.js";
import { createAnalysisController, getUserAnalysisController } from "../controllers/analysis.controller.js";
import { uploadRepositoryController } from "../controllers/upload.controller.js";

const router = Router();

router.post("/", createAnalysisController);

router.post(
  "/:analysisId/upload",
  upload.single("repository"),
  uploadRepositoryController,
);

router.get(
  "/:analysisId/:userId", 
  getUserAnalysisController
)
export default router;
