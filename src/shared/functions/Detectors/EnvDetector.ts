import { NODE_ENV } from "../../secrets/env.secrect.js";

export type AppEnvironment = "production" | "development";

export const EnvDetector = (): AppEnvironment => {
  return NODE_ENV === "production" ? "production" : "development";
};
