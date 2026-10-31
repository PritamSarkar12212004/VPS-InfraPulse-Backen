import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

import {
  accessKey,
  jwtConfig,
} from "../../../shared/services/jwt/jwt.config.js";
import { redis } from "../../services/redis/redis.config.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
    }

    let payload;

    try {
      const verified = await jwtVerify(token, accessKey, {
        algorithms: [jwtConfig.algorithm],
      });

      payload = verified.payload;
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    const userId = payload.sub;
    const sessionId = payload.sessionId;

    if (
      payload.type !== jwtConfig.access.type ||
      typeof userId !== "string" ||
      typeof sessionId !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token payload",
      });
    }

    let sessionData: string | null;

    try {
      sessionData = await redis.get(`auth:session:${sessionId}`);
    } catch {
      return res.status(503).json({
        success: false,
        message: "Authentication service unavailable",
      });
    }

    if (!sessionData) {
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked",
      });
    }

    const session = JSON.parse(sessionData);

    if (session.userId !== userId) {
      return res.status(401).json({
        success: false,
        message: "Session validation failed",
      });
    }

    req.user = {
      userId,
      sessionId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
