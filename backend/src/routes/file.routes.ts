import { Router } from "express";
import { getAnalysisFilesController } from "../controllers/file.controller.js";

const router = Router();

router.get("/:analysisId", getAnalysisFilesController);

export default router;
