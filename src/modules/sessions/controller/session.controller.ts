import type { Request, Response } from "express";

import { redis } from "../../../shared/services/redis/redis.config.js";

import {
  response200,
  response503,
} from "../../../shared/response/serverResponse.js";

export const sessionController = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId: currentSessionId } = req.user!;
    const userSessionsKey = `auth:user-sessions:${userId}`;
    const sessionIds = await redis.sMembers(userSessionsKey);
    const sessions = [];

    for (const id of sessionIds) {
      const sessionKey = `auth:session:${id}`;

      const [rawSession, ttl] = await Promise.all([
        redis.get(sessionKey),
        redis.ttl(sessionKey),
      ]);

      if (!rawSession) {
        await redis.sRem(userSessionsKey, id);
        continue;
      }

      const session = JSON.parse(rawSession);

      if (session.userId !== userId) {
        await redis.sRem(userSessionsKey, id);
        continue;
      }

      sessions.push({
        sessionId: id,
        isCurrent: id === currentSessionId,
        expiresIn: ttl,
      });
    }

    return response200({
      message: "Sessions fetched successfully",
      res,
      data: {
        totalSessions: sessions.length,
        sessions,
      },
    });
  } catch (error) {
    console.error("Session fetch error:", error);

    return response503({
      message: "Unable to fetch sessions",
      res,
      data: null,
    });
  }
};
