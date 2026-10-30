import type { Request, Response } from "express";
import { otpRequestField } from "../fields/otpRequest.field.js";
import { User } from "../models/user.model.js";
import { logger } from "../../../shared/config/logging.config.js";
import {
  response200,
  response404,
  response500,
} from "../../../shared/response/serverResponse.js";
import { sendWhatsAppOtp } from "../../../shared/services/whatsapp/whatsapp.service.js";
import { OTP_SERVICE_IMAGE_URI } from "../../../shared/secrets/otp.secret.js";
import { generateOtpCode } from "../helper/generateOtpCode.js";
import { authRedisChekk, authRedisset } from "../functions/authRedisFunc.js";

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

    const redisResponse = await authRedisChekk({ phone });

    if (redisResponse.status) {
      response200({
        message: "OTP already sent. Please wait.",
        res,
        data: {
          remainingTime: redisResponse.data?.remainingTime,
        },
      });
    } else {
      const otpCode = generateOtpCode();

      let whatsappResult:
        | { success: boolean; statusCode?: number; message?: string }
        | undefined;
      try {
        const result = await sendWhatsAppOtp(
          phone,
          otpCode,
          OTP_SERVICE_IMAGE_URI,
        );
        whatsappResult = {
          success: result.success,
          statusCode: result.statusCode,
          message: result.message,
        };
        await authRedisset({ phone: phone, otphash: otpCode });
        logger.info(
          { phone, statusCode: result.statusCode, success: result.success },
          "WhatsApp OTP delivery result:",
        );
      } catch (whatsappError) {
        logger.error({ err: whatsappError }, "WhatsApp OTP service error:");
        whatsappResult = {
          success: false,
          message:
            whatsappError instanceof Error
              ? whatsappError.message
              : String(whatsappError),
        };
      }

      response200({
        message: "OTP request accepted",
        res: res,
        data: {
          whatsapp: whatsappResult,
        },
      });
    }
  } catch (error) {
    logger.error({ err: error }, "OTP request failed:");
    response500({ res: res });
  }
};
