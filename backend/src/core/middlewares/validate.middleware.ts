import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const firstErrorMessage = (error: ZodError): string =>
  error.issues[0]?.message ?? "Validation failed";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: firstErrorMessage(result.error),
          errors: result.error.flatten().fieldErrors,
        });
        return;
      }

      req.body = result.data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: firstErrorMessage(error),
          errors: error.flatten().fieldErrors,
        });
        return;
      }

      next(error);
    }
  };
