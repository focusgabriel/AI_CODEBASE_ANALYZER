import { Router } from "express";
import { forgotPasswordController, getCurrentUserController, LoginAccountController, LogoutAccountController, RefreshTokenController, RegisterAccountController, ResetPasswordController, verificationAccountController } from "../controllers/auth.controller.js";
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
router.get("/auth/verify-email/:token", verificationAccountController);
router.post("/auth/forgot-password/", authLimiter, forgotPasswordController);
router.post("/auth/reset-password/:token", authLimiter, ResetPasswordController);

export default router;