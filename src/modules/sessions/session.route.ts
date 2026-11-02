import express from "express";
import { sessionField } from "./field/session.field.js";
import {
  IpLimiter,
  phoneRateLimit,
} from "../../shared/services/rateLimit/Limiter.js";
import { validateRequest } from "../../shared/middlewares/validations/validateRequest.middleware.js";
import { sessionValidation } from "./validation/session.validation.js";
import { sessionController } from "./controller/session.controller.js";
import { authMiddleware } from "../../shared/middlewares/jwt/jtwMiddleWare.js";

const route = express.Router();

route.get(
  sessionField.sessions,
  IpLimiter,
  phoneRateLimit,
  authMiddleware,
  validateRequest(sessionValidation),
  sessionController,
);

export { route as sessionRoute };
