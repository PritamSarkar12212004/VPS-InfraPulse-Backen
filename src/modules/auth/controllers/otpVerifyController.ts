import { Request, Response } from "express";
import { otpRequestField } from "../fields/otpRequest.field.js";
import { authRedisOtpVerify } from "../functions/authRedisFunc.js";
import { authRedisField } from "../fields/authRedisField.js";
import { response200, response404 } from "../../../shared/response/serverResponse.js";

export const otpVerifyController = async (req: Request, res: Response) => {
  const otp = req.body[otpRequestField.otp];
  const phone = req.body[otpRequestField.phone];
  const redisResponse = await authRedisOtpVerify({ phone: phone, otp: otp });

  if (redisResponse.message.includes(authRedisField.expired)) {
    return response404({
      message: "OTP expired",
      res: res,
      data: null,
    });
  } else if (redisResponse.message.includes(authRedisField.invalid)) {
    return response404({
      message: "OTP invalid",
      res: res,
      data: null,
    });
  } else {
    
    return response200({
      message: "OTP Verify Successfully",
      res: res,
      data: null,
    });
  }
};
