import compression from "compression";

export const compressionMiddleware = compression({
  // ignore 1kb size  response
  threshold: 1024,
  level: 6,
});
