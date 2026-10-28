import helmet from "helmet";
import { EnvDetector } from "../functions/Detectors/EnvDetector.js";

const isProduction = EnvDetector();

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      "upgrade-insecure-requests": isProduction ? [] : null,
    },
  },
  strictTransportSecurity: isProduction ? undefined : false,
});
