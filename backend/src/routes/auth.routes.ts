import { Router } from "express";
import { getCurrentUserController, LoginAccountController, LogoutAccountController, RefreshTokenController, RegisterAccountController } from "../controllers/auth.controller.js";
import { validate } from "../core/middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validation/auth.schema.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";
import { authLimiter } from "../validation/authLimiter.js";

const router = Router();

router.post("/auth/register", authLimiter, validate(registerSchema), RegisterAccountController);
router.post("/auth/login", authLimiter, validate(loginSchema), LoginAccountController);
router.post("/auth/logout", LogoutAccountController);
router.post("/refresh", RefreshTokenController);
router.get("/auth/me", authMiddleware, getCurrentUserController)

export default router;