import type { Request, Response } from "express";
import { otpRequestField } from "../fields/otpRequest.field.js";
import { User } from "../models/user.model.js";
import { redisSet } from "../../../shared/services/redis/functions/redisFunc.js";
import { logger } from "../../../shared/config/logging.config.js";
import {
  response200,
  response500,
} from "../../../shared/response/serverResponse.js";

export const requestOtpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const phone = req.body[otpRequestField.phone];
    const name = req.body[otpRequestField.name];

    const isExist = await User.findOne({
      [otpRequestField.phone]: phone,
    });

    if (!isExist) {
      await User.create({
        [otpRequestField.name]: name,
        [otpRequestField.phone]: phone,
      });
      logger.info("New user created:");
    } else {
      logger.info("User already exists:");
    }

    await redisSet({
      key: `otp:cooldown:${phone}`,
      value: "1",
      expirySeconds: 30,
    });
    response200({
      message: "OTP request accepted",
      res: res,
    });
  } catch (error) {
    logger.error({ err: error }, "OTP request failed:");
    response500({ res: res });
  }
};
