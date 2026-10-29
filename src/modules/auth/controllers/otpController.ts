import type { Request, Response } from "express";
import { otpRequestField } from "../fields/otpRequest.field.js";
import { User } from "../models/user.model.js";
import { redisSet } from "../../../shared/services/redis/functions/redisFunc.js";
import { logger } from "../../../shared/config/logging.config.js";
import {
  response200,
  response500,
} from "../../../shared/response/serverResponse.js";
import { wpi } from "../../../shared/utils/api/wpi.js";
import { authPath } from "../auth.path.js";
import { otpTemplateBody } from "../templates/otp.template.js";
import { OTP_TOKEN } from "../../../shared/secrets/otp.secret.js";

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
      logger.info({ phone, name }, "New user created:");
    } else {
      logger.info({ phone }, "User already exists:");
    }
    try {
      const externalCall = await wpi.post(
        authPath.externalRequestOtp,
        otpTemplateBody({
          to: phone,
          otp_code: "123456",
          uri: "templateUri",
        }),
        {
          headers: {
            Authorization: `Bearer ${OTP_TOKEN}`,
          },
        },
      );
      logger.info({ externalCall }, "WhatsApp OTP sent:");
    } catch (whatsappError) {
      console.log(whatsappError)
      logger.error({ err: whatsappError }, "WhatsApp OTP failed:");
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
