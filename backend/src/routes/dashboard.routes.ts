import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, DashboardController);


export default router;