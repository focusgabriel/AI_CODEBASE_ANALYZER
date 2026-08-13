import { Router } from "express";
import { getReportController } from "../controllers/report.controller.js";
// import { errorHandler } from "../core/middlewares/errorHandler.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.get("/:analysisId/", authMiddleware, getReportController);

export default router;