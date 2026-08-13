import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {


  const token = req.cookies.accessToken;
  console.log("🍪 COOKIES:", req.cookies);
console.log("📨 COOKIE HEADER:", req.headers.cookie);

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      if(typeof decoded === "string" || !("sub" in decoded)){
        throw new AppError("Invalid Token", 401);
      }
      req.user = {
        id: decoded.sub as string,
      }
    next()
    } catch (error) {
      throw new AppError("Invalid Token", 401);
  }
}



