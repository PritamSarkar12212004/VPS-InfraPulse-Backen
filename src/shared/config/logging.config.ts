import pino from "pino";
import { pinoHttp } from "pino-http";
import pinoPretty from "pino-pretty";

const isDevelopment = process.env.NODE_ENV === "development";

const prettyStream = pinoPretty({
  colorize: true,
  levelFirst: true,
  translateTime: "SYS:standard",
  ignore: "pid,hostname",
  messageFormat: (log) => log.msg,
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.headers.x-api-key",
        "res.headers.set-cookie",
      ],
      censor: "[REDACTED]",
    },
  },
  isDevelopment ? prettyStream : undefined,
);

export const httpLogger = pinoHttp({
  logger,
  autoLogging: true,
  customLogLevel: (res) => {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "debug"; // successful requests hidden at LOG_LEVEL=info
  },
  customSuccessMessage: () => "✅ request completed",
  customErrorMessage: () => "❌ request failed",
});
