import express from "express";
import { authPath } from "./auth.path.js";
import { requestOtpController } from "./controllers/otpController.js";
import {
  IpLimiter,
  phoneRateLimit,
} from "../../shared/services/rateLimit/Limiter.js";

const route = express.Router();

route.post(
  authPath.requestOtp,
  IpLimiter,
  phoneRateLimit,
  requestOtpController,
);

export { route as AuthRoute };
