import "dotenv/config";

import express from "express";

import { corsMiddleware } from "./src/shared/config/cors.config.js";
import { helmetMiddleware } from "./src/shared/config/helmet.config.js";
import { compressionMiddleware } from "./src/shared/config/compression.config.js";
import { httpLogger } from "./src/shared/config/logging.config.js";
import { PORT } from "./src/shared/secrets/env.secrect.js";

const app = express();

app.disable("x-powered-by");

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(express.json({ limit: "5mb" }));
app.use(httpLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "InfraPulse API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`InfraPulse server running on port ${PORT}`);
});

export default app;
