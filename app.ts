import "dotenv/config";
import express from "express";

import { corsMiddleware } from "./src/shared/config/cors.config.js";
import { helmetMiddleware } from "./src/shared/config/helmet.config.js";
import { compressionMiddleware } from "./src/shared/config/compression.config.js";
import { httpLogger, logger } from "./src/shared/config/logging.config.js";
import { PORT } from "./src/shared/secrets/env.secrect.js";
import { DatabseConnect } from "./src/shared/database/mongoDb.js";
import { connectRedis } from "./src/shared/services/redis/redis.config.js";
import { AuthRoute } from "./src/modules/auth/auth.route.js";
import { createServer } from "node:http";
import { initializeSocket } from "./src/shared/services/socket/socket.config.js";
import { CpuRoute } from "./src/modules/cpu/cpu.routes.js";
import { authMiddleware } from "./src/shared/middlewares/jwt/jtwMiddleWare.js";
import { RefreshRoute } from "./src/modules/redis/refresh.route.js";
import { sessionRoute } from "./src/modules/sessions/session.route.js";

const app = express();

app.disable("x-powered-by");

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(express.json({ limit: "5mb" }));
app.use(httpLogger);

const httpServer = createServer(app);
initializeSocket(httpServer);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "InfraPulse API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
  
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/refresh", RefreshRoute);
app.use("/api/v1/session", sessionRoute);
app.use("/api", authMiddleware);
app.use("/api/v1/cpu", CpuRoute);

await DatabseConnect();
await connectRedis();
app.listen(PORT, "0.0.0.0", () => {
  logger.info(`InfraPulse server running on port ${PORT}`);
});

export default app;
