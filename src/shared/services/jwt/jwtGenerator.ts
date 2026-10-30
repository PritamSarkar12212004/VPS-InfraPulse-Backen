import { SignJWT } from "jose";
import { JwtGenerateType } from "./jwd.type.js";
import { accessKey, jwtConfig, refreshKey } from "./jwt.config.js";

export const generateAccessToken = async ({
  userId,
}: JwtGenerateType): Promise<string> => {
  return new SignJWT({
    type: jwtConfig.access.type,
  })
    .setProtectedHeader({
      alg: jwtConfig.algorithm,
    })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(jwtConfig.access.expiresIn)
    .sign(accessKey);
};

export const generateRefreshToken = async ({
  userId,
}: JwtGenerateType): Promise<string> => {
  return new SignJWT({
    type: jwtConfig.refresh.type,
  })
    .setProtectedHeader({
      alg: jwtConfig.algorithm,
    })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(jwtConfig.refresh.expiresIn)
    .sign(refreshKey);
};
