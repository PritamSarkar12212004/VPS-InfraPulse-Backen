import express from "express";
import { authPath } from "./auth.path.js";
import { requestOtpController } from "./controllers/otpController.js";
import {
  IpLimiter,
  phoneRateLimit,
} from "../../shared/services/rateLimit/Limiter.js";
import { otpRequestSchema } from "./validations/otpRequest.validator.js";
import { validateRequest } from "../../shared/middlewares/validations/validateRequest.middleware.js";

const route = express.Router();

route.post(
  authPath.requestOtp,
  IpLimiter,
  phoneRateLimit,
  validateRequest(otpRequestSchema),
  requestOtpController,
);

export { route as AuthRoute };
