import { has } from "../../../shared/functions/encryption/hashing.js";
import {
  redisDelete,
  redisRead,
  redisSet,
  redisTTL,
} from "../../../shared/services/redis/functions/redisFunc.js";
import {
  AuthRedisResponse,
  OtpVerifyInter,
  RedisFunctionInter,
  RedisFunctionVerify,
} from "../auth.types.js";
import { authRedisField } from "../fields/authRedisField.js";

export const authRedisset = async ({ phone, otphash }: RedisFunctionInter) => {
  const otphashCode = await has({ value: otphash });
  const phoneHash = await has({ value: phone });
  await redisSet({
    key: `otp:cooldown:${phoneHash}`,
    value: otphashCode,
    expirySeconds: 30,
  });
};

export const authRedisChekk = async ({
  phone,
}: RedisFunctionVerify): Promise<AuthRedisResponse> => {
  const phoneHash = await has({ value: phone });
  const key = `otp:cooldown:${phoneHash}`;

  const [isPresent, remainingTime] = await Promise.all([
    redisRead({ key }),
    redisTTL({ key }),
  ]);

  if (!isPresent || remainingTime <= 0) {
    return {
      status: false,
      message: [authRedisField.expired],
      data: null,
    };
  }

  return {
    status: true,
    message: [authRedisField.success],
    data: {
      remainingTime,
    },
  };
};

export const authRedisOtpVerify = async ({
  phone,
  otp,
}: OtpVerifyInter): Promise<AuthRedisResponse> => {
  const phoneHash = await has({ value: phone });
  const key = `otp:cooldown:${phoneHash}`;

  const [isPresent, remainingTime] = await Promise.all([
    redisRead({ key }),
    redisTTL({ key }),
  ]);

  if (!isPresent || remainingTime <= 0) {
    return {
      status: false,
      message: [authRedisField.expired],
      data: null,
    };
  }

  const otphashCode = await has({ value: otp });
  if (otphashCode !== isPresent)
    return {
      status: false,
      message: [authRedisField.invalid],
      data: null,
    };

  await redisDelete({ key });

  return {
    status: true,
    message: [authRedisField.success],
    data: null,
  };
};
