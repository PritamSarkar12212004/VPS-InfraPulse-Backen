import express from "express";
import { authPath } from "./auth.path.js";
import { requestOtpController } from "./controllers/otpController.js";
import {
  IpLimiter,
  phoneRateLimit,
} from "../../shared/services/rateLimit/Limiter.js";
import {
  otpRequestSchema,
  otpVerifySchema,
} from "./validations/otpRequest.validator.js";
import { validateRequest } from "../../shared/middlewares/validations/validateRequest.middleware.js";

const route = express.Router();

route.post(
  authPath.inappOtpRequest,
  IpLimiter,
  phoneRateLimit,
  validateRequest(otpRequestSchema),
  requestOtpController,
);
route.post(
  authPath.inappOtpVeridy,
  IpLimiter,
  phoneRateLimit,
  validateRequest(otpVerifySchema),
  requestOtpController,
);
export { route as AuthRoute };
