import cors from "cors";
import type { CorsOptions } from "cors";
import {
  credentials,
  exposedHeaders,
  FrontendOriginDevelopment,
  FrontendOriginProduction,
  Headers,
  maxAge,
  optionsSuccessStatus,
  requestMethod,
} from "../secrets/origin.secret.js";

const allowedOrigins = new Set<string>([
  FrontendOriginDevelopment,
  FrontendOriginProduction,
]);

const corsOptions: CorsOptions = {
    
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin not allowed"));
  },

  methods: requestMethod,
  allowedHeaders: Headers,
  exposedHeaders: exposedHeaders,
  credentials: credentials,
  maxAge: maxAge,
  optionsSuccessStatus: optionsSuccessStatus,

};

const corsMiddleware = cors(corsOptions);
export { corsMiddleware, corsOptions };
