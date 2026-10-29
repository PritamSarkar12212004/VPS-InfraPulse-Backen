import { createClient, type RedisClientType } from "redis";
import { logger } from "../../config/logging.config.js";
import { REDIS_URL } from "../../secrets/database.secrect.js";


if (!REDIS_URL) {
  throw new Error("REDIS_URL is not configured in environment variables");
}

export const redis: RedisClientType = createClient({
  url: REDIS_URL,
  socket: {
    connectTimeout: 10_000,
    reconnectStrategy: (retries: number) => {
      if (retries >= 10) {
        return new Error("Redis reconnect limit reached");
      }

      return Math.min(retries * 500, 3_000);
    },
  },
});

redis.on("error", (error: Error) => {
  logger.error("[Redis] Connection error:", error.message);
});

redis.on("connect", () => {
  logger.info("[Redis] Connected");
});

redis.on("ready", () => {
  logger.info("[Redis] Connection ready");
});

redis.on("reconnecting", () => {
  logger.warn("[Redis] Reconnecting...");
});

redis.on("end", () => {
  logger.warn("[Redis] Connection closed");
});

let redisConnectionRetryCount = 0;
const MAX_REDIS_CONNECTION_RETRIES = 5;

export const connectRedis = async (): Promise<void> => {
  try {
    if (redis.isOpen) {
      logger.info("[Redis] Already connected");
      return;
    }

    await redis.connect();
    redisConnectionRetryCount = 0;
    logger.info("[Redis] Connected successfully");
  } catch (error) {
    redisConnectionRetryCount++;

    if (redisConnectionRetryCount <= MAX_REDIS_CONNECTION_RETRIES) {
      const delay = Math.min(1000 * 2 ** redisConnectionRetryCount, 30_000);
      logger.warn(
        `[Redis] Initial connection failed, retrying in ${delay}ms... (attempt ${redisConnectionRetryCount}/${MAX_REDIS_CONNECTION_RETRIES})`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      await connectRedis();
    } else {
      logger.error("[Redis] Connection failed after max retries:", error);
      throw error;
    }
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redis.isOpen) {
      await redis.disconnect();
      logger.info("[Redis] Disconnected successfully");
    } else {
      logger.info("[Redis] Not connected");
    }
  } catch (error) {
    logger.error("[Redis] Error disconnecting:", error);
    throw error;
  }
};
