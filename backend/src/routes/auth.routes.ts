import { Router } from "express";
import { getCurrentUserController, LoginAccountController, LogoutAccountController, RefreshTokenController, RegisterAccountController } from "../controllers/auth.controller.js";
import { validate } from "../core/middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validation/auth.schema.js";
import { authMiddleware } from "../core/middlewares/authMiddleware.js";

const router = Router();

router.post("/auth/register", validate(registerSchema), RegisterAccountController);
router.post("/auth/login", validate(loginSchema), LoginAccountController);
router.post("/auth/logout", LogoutAccountController);
router.post("/refresh", RefreshTokenController);
router.get("/auth/me", authMiddleware, getCurrentUserController)

export default router;