import { rateLimit } from "express-rate-limit";

export const createRateLimit = (windowMs: number, limit: number) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });
