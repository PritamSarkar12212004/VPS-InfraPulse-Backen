import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";

import { otpRequestField } from "../fields/otpRequest.field.js";
import { authRedisOtpVerify } from "../redis/authRedisFunc.js";
import { authRedisField } from "../fields/authRedisField.js";
import {
  response200,
  response404,
} from "../../../shared/response/serverResponse.js";
import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/services/jwt/jwtGenerator.js";
import { has } from "../../../shared/functions/encryption/hashing.js";
import { REDIS_EXPIRE } from "../../../shared/secrets/database.secrect.js";
import { redis } from "../../../shared/services/redis/redis.config.js";

export const otpVerifyController = async (req: Request, res: Response) => {
  const otp = req.body[otpRequestField.otp];
  const phone = req.body[otpRequestField.phone];

  const redisResponse = await authRedisOtpVerify({
    phone,
    otp,
  });

  if (redisResponse.message.includes(authRedisField.expired)) {
    return response404({
      message: "OTP expired",
      res,
      data: null,
    });
  }

  if (redisResponse.message.includes(authRedisField.invalid)) {
    return response404({
      message: "OTP invalid",
      res,
      data: null,
    });
  }

  const user = await User.findOne({
    [otpRequestField.phone]: phone,
  });

  if (!user) {
    return response404({
      message: "User Not Exist",
      res,
      data: null,
    });
  }

  const userId = user._id.toString();
  const sessionId = randomUUID();

  const accessToken = await generateAccessToken({
    userId: userId,
    sessionId: sessionId,
  });
  const refreshToken = await generateRefreshToken({
    userId: userId,
    sessionId: sessionId,
  });

  const hashRefreshToken = await has({
    value: refreshToken,
  });

  const sessionKey = `auth:session:${sessionId}`;
  const userSessionsKey = `auth:user-sessions:${userId}`;

  await redis
    .multi()
    .set(
      sessionKey,
      JSON.stringify({
        userId,
        hashRefreshToken,
      }),
      {
        EX: REDIS_EXPIRE,
      },
    )
    .sAdd(userSessionsKey, sessionId)
    .exec();

  return response200({
    message: "OTP Verify Successfully",
    res,
    data: {
      accessToken,
      refreshToken,
      user: {
        userId: user._id.toString(),
        name: user.name,
        phone: user.phone,
      },
    },
  });
};
