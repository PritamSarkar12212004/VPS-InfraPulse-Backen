import express from "express";
import { redisRefreshSchema } from "./validation/redisRefresh.validation.js";
import { validateRequest } from "../../shared/middlewares/validations/validateRequest.middleware.js";
import { refreshTokenController } from "./redisRefresh.controller.js";
const route = express.Router();

route.post(
  "/token",
  validateRequest(redisRefreshSchema),
  refreshTokenController,
);
export { route as RefreshRoute };
