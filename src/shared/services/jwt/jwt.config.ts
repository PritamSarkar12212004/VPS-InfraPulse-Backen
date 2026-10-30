import {
  JWT_ACCESS_EXPIRE,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRE,
  JWT_REFRESH_SECRET,
} from "../../secrets/jwt.secrets.js";

export const accessKey = new TextEncoder().encode(JWT_ACCESS_SECRET);

export const refreshKey = new TextEncoder().encode(JWT_REFRESH_SECRET);

export const jwtConfig = {
  algorithm: "HS256" as const,

  access: {
    expiresIn: JWT_ACCESS_EXPIRE,
    type: "access" as const,
  },

  refresh: {
    expiresIn: JWT_REFRESH_EXPIRE,
    type: "refresh" as const,
  },
};
