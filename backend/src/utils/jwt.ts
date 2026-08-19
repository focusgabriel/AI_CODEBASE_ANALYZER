import jwt from "jsonwebtoken";
import { env } from "../core/config/env.js";

export const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const JWT_ISSUER = "ai-codebase-analyzer";
const ACCESS_TOKEN_AUDIENCE = "api";
const REFRESH_TOKEN_AUDIENCE = "refresh";

export function generateAccessToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    env.JWT_ACCESS_SECRET,
    {
      algorithm: "HS256",
      audience: ACCESS_TOKEN_AUDIENCE,
      expiresIn: "15m",
      issuer: JWT_ISSUER,
    },
  );
}

export function generateRefreshToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    env.JWT_REFRESH_SECRET,
    {
      algorithm: "HS256",
      audience: REFRESH_TOKEN_AUDIENCE,
      expiresIn: "7d",
      issuer: JWT_ISSUER,
    },
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    algorithms: ["HS256"],
    audience: ACCESS_TOKEN_AUDIENCE,
    issuer: JWT_ISSUER,
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, {
    algorithms: ["HS256"],
    audience: REFRESH_TOKEN_AUDIENCE,
    issuer: JWT_ISSUER,
  });
}
