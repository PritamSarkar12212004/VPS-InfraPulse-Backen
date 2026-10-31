import z from "zod";
import { redisField } from "../field/redis.field.js";

export const redisRefreshSchema = z
  .object({
    [redisField.refreshToken]: z
      .string()
      .trim()
      .min(1, "Refresh token is required"),
  })
  .strict();

export type RedisRefreshSchema = z.infer<typeof redisRefreshSchema>;
