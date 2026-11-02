import type { Request, Response } from "express";

import { jwtVerify } from "jose";
import { jwtConfig, refreshKey } from "../../shared/services/jwt/jwt.config.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../shared/services/jwt/jwtGenerator.js";
import { has } from "../../shared/functions/encryption/hashing.js";
import { redis } from "../../shared/services/redis/redis.config.js";
import { REDIS_EXPIRE } from "../../shared/secrets/database.secrect.js";
import { sessionRotation } from "./script/sessionRotation.script.js";
import {
  response200,
  response400,
  response401,
  response503,
} from "../../shared/response/serverResponse.js";

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken || typeof refreshToken !== "string") {
    response400({
      message: "Refresh token required",
      data: null,
      res: res,
    });
    return;
  }

  let userId: string;
  let sessionId: string;

  try {
    const { payload } = await jwtVerify(refreshToken, refreshKey, {
      algorithms: [jwtConfig.algorithm],
    });

    if (
      payload.type !== jwtConfig.refresh.type ||
      typeof payload.sub !== "string" ||
      typeof payload.sessionId !== "string"
    ) {
      return response401({
        message: "Invalid refresh token",
        res: res,
        data: null,
      });
    }

    userId = payload.sub;
    sessionId = payload.sessionId;
  } catch {
    return response401({
      message: "Refresh token expired or invalid",
      res: res,
      data: null,
    });
  }

  const newAccessToken = await generateAccessToken({
    userId,
    sessionId,
  });

  const newRefreshToken = await generateRefreshToken({
    userId,
    sessionId,
  });

  const oldRefreshTokenHash = await has({
    value: refreshToken,
  });

  const newRefreshTokenHash = await has({
    value: newRefreshToken,
  });

  const sessionKey = `auth:session:${sessionId}`;

  let rotationResult: number;

  try {
    rotationResult = Number(
      await redis.eval(sessionRotation, {
        keys: [sessionKey],
        arguments: [
          userId,
          oldRefreshTokenHash,
          newRefreshTokenHash,
          String(REDIS_EXPIRE),
        ],
      }),
    );
  } catch {
    return response503({
      message: "Authentication service unavailable",
      res: res,
      data: null,
    });
  }

  if (rotationResult !== 1) {
    response401({
      message: "Refresh session invalid or revoked",
      res: res,
      data: null,
    });
    return;
  }

  response200({
    message: "Token refreshed successfully",
    res: res,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });
};
