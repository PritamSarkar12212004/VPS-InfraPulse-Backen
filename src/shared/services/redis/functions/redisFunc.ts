import { convertToString } from "../../../functions/convators/convertToString.js";
import { redis } from "../redis.config.js";
import type { RedisKey, RedisKeyValue, RedisDelete } from "../redis.type.js";

export const redisRead = async ({ key }: RedisKey): Promise<string | null> => {
  return redis.get(key);
};

export const redisSet = async ({
  key,
  value,
  expirySeconds,
}: RedisKeyValue): Promise<void> => {
  const stringValue =
    typeof value === "string" ? value : convertToString(value);

  if (expirySeconds !== undefined) {
    await redis.set(key, stringValue, {
      EX: expirySeconds,
    });
    return;
  }

  await redis.set(key, stringValue);
};

export const redisDelete = async ({ key }: RedisDelete): Promise<number> => {
  return redis.del(key);
};

export const redisExists = async ({ key }: RedisKey): Promise<boolean> => {
  return (await redis.exists(key)) === 1;
};
