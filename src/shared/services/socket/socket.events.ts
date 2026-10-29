export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  PING: "client:ping",
  PONG: "server:pong",

  SERVER_STATUS: "server:status",
  SERVER_METRICS: "server:metrics",
  SERVER_ALERT: "server:alert",
} as const;
