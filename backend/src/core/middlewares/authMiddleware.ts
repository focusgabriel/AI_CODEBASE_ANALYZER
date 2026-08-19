import {NextFunction, Request, Response} from "express";
import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "../../utils/jwt.js";

function getAccessToken(req: Request): string | undefined {
  if (req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length).trim() || undefined;
}

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const token = getAccessToken(req);

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const decoded = verifyAccessToken(token);
    if (typeof decoded === "string" || typeof decoded.sub !== "string" || !decoded.sub) {
      return next(new AppError("Invalid Token", 401));
    }
    req.user = {
      id: decoded.sub as string,
    };
    next();
  } catch {
    return next(new AppError("Invalid Token", 401));
  }
};



