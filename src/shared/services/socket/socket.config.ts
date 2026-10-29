import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { logger } from "../../config/logging.config.js";
import { registerSocketHandlers } from "./handlers/registerSocketHandlers.js";
import {
  FrontendOriginDevelopment,
  FrontendOriginProduction,
} from "../../secrets/origin.secret.js";

let io: Server | null = null;

export const initializeSocket = (httpServer: HttpServer): Server => {
  if (io) {
    return io;
  }

  io = new Server(httpServer, {
    cors: {
      origin: [FrontendOriginDevelopment, FrontendOriginProduction].filter(
        (origin): origin is string => Boolean(origin),
      ),
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket client connected");

    registerSocketHandlers(socket);

    socket.on("disconnect", (reason) => {
      logger.info(
        { socketId: socket.id, reason },
        "Socket client disconnected",
      );
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
