import { jwtVerify } from "jose";
import { accessKey, jwtConfig, refreshKey } from "./jwt.config.js";
import { JwtVerifyType } from "./jwd.type.js";

export const verifyAccessToken = async ({ token }: JwtVerifyType) => {
  const { payload } = await jwtVerify(token, accessKey, {
    algorithms: [jwtConfig.algorithm],
  });

  if (payload.type !== jwtConfig.access.type || !payload.sub) {
    throw new Error("Invalid access token");
  }

  return {
    userId: payload.sub,
  };
};

export const verifyRefreshToken = async ({ token }: JwtVerifyType) => {
  const { payload } = await jwtVerify(token, refreshKey, {
    algorithms: [jwtConfig.algorithm],
  });

  if (payload.type !== jwtConfig.refresh.type || !payload.sub) {
    throw new Error("Invalid refresh token");
  }

  return {
    userId: payload.sub,
  };
};
