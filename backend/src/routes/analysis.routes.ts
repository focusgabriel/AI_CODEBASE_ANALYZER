// import { Router } from "express";
// import { AnalysisController } from "../controllers/analysis.controller.js";

// const router = Router();

// const analysisController = new AnalysisController();

// router.post("/", analysisController.createAnalysis.bind(analysisController));

// export default router;

import { Router } from "express";
import { upload } from "../config/multer.js";
import { createAnalysisController, deleteAnalysisController, getAllAnalysisForUserController, getScoreTrendController, getUserAnalysisController, renameAnalysisController } from "../controllers/analysis.controller.js";
import { uploadRepositoryController } from "../controllers/upload.controller.js";
import { errorHandler } from "../core/middlewares/errorHandler.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createAnalysisController);

router.post(
  "/:analysisId/upload",
  authMiddleware,
  upload.single("repository"),
  uploadRepositoryController,
);
router.get(
  "/score-trend",
  authMiddleware,
  getScoreTrendController,
);

router.get(
  "/:analysisId/", 
  authMiddleware,
  getUserAnalysisController
)

router.get(
  "/",
  authMiddleware,
  getAllAnalysisForUserController
)

router.patch(
  "/:analysisId",
  authMiddleware,
  renameAnalysisController,
);

router.delete(
  "/:analysisId",
  authMiddleware,
  deleteAnalysisController,
);

export default router;
