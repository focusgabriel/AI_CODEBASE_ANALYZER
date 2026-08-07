import { Router } from "express";
import { getReportController } from "../controllers/report.controller.js";

const router = Router();

router.get("/:analysisId/:userId", getReportController);

export default router;