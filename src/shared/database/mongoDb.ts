import mongoose from "mongoose";
import { logger } from "../config/logging.config.js";
import {
  MONGO_CLUSTER,
  MONGO_PASSWORD,
  MONGO_URI_PART1,
  MONGO_URI_PART2,
  MONGO_USERNAME,
} from "../secrets/database.secrect.js";

export const DatabseConnect = async (): Promise<void> => {
  if (
    !MONGO_USERNAME ||
    !MONGO_PASSWORD ||
    !MONGO_URI_PART1 ||
    !MONGO_CLUSTER ||
    !MONGO_URI_PART2
  ) {
    throw new Error("MONGO DB is not configured");
  }

  mongoose.set("strictQuery", true);
  mongoose.connection.on("connected", () => {
    logger.info("[MongoDB] Connected successfully");
  });
  mongoose.connection.on("disconnected", () => {
    logger.warn("[MongoDB] Connection lost");
  });
  mongoose.connection.on("error", (error: Error) => {
    logger.error(`[MongoDB] Connection error: ${error.message}`);
  });

  const MONGO_FULL_URI = `${MONGO_URI_PART1}${MONGO_USERNAME}:${MONGO_PASSWORD}${MONGO_CLUSTER}${MONGO_URI_PART2}`;
  
  await mongoose.connect(MONGO_FULL_URI, {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    maxPoolSize: 10,
    minPoolSize: 2,
    autoIndex: process.env.NODE_ENV !== "production",
  });
};

export const disconnectMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info("[MongoDB] Disconnected successfully");
  }
};
