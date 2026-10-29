import { RATE_LIMIT } from "../../secrets/env.secrect.js";
import { minutesToMilliseconds } from "./ratelimit.helper.js";
import { createRateLimit } from "./rateLimit.service.js";
import { rateLimit } from "express-rate-limit";

export const IpLimiter = createRateLimit(
  minutesToMilliseconds(RATE_LIMIT.AUTH.IP_BASED.TIME),
  RATE_LIMIT.AUTH.IP_BASED.REQUEST,
);

export const phoneRateLimit = rateLimit({
  windowMs: minutesToMilliseconds(RATE_LIMIT.AUTH.PHONE_BASED.TIME),
  limit: RATE_LIMIT.AUTH.PHONE_BASED.REQUEST,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as typeof req & { phone?: string }).phone ?? "missing-phone";
  },
  message: {
    success: false,
    message:
      "Too many OTP requests for this phone number. Please try again later.",
  },
});
