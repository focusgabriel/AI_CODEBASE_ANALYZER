import { Router } from "express";
import { LoginAccountController, RegisterAccountController } from "../controllers/auth.controller.js";
import { errorHandler } from "../core/middlewares/errorHandler.js";
import { validate } from "../core/middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validation/auth.schema.js";
import { uploadRepositoryController } from "../controllers/upload.controller.js";

const router = Router();

router.post("/auth/register", validate(registerSchema), RegisterAccountController);
router.post("/auth/login", validate(loginSchema), LoginAccountController);
router.post("/refresh", uploadRepositoryController);

export default router;