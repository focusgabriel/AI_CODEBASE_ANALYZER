import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    if (typeof decoded === "string" || !("sub" in decoded)) {
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



