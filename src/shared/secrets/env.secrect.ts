export const NODE_ENV = process.env.NODE_ENV;
export const PORT = Number.parseInt(process.env.PORT!, 10);

export const RATE_LIMIT = {
  AUTH: {
    IP_BASED: {
      TIME: Number.parseInt(process.env.IP_BASED_RATE_LIMIT_TIME!, 10),
      REQUEST: Number.parseInt(process.env.IP_BASED_RATE_LIMIT_REQUEST!, 10),
    },
    PHONE_BASED: {
      TIME: Number.parseInt(process.env.PHONE_BASED_RATE_LIMIT_TIME!, 10),
      REQUEST: Number.parseInt(process.env.PHONE_BASED_RATE_LIMIT_REQUEST!, 10),
    },
  },
};
