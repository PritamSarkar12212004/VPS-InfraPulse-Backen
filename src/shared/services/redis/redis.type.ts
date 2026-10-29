export interface RedisKey {
  key: string;
}

export interface RedisKeyValue extends RedisKey {
  value: string;
  expirySeconds?: number;
}

export interface RedisDelete extends RedisKey {}