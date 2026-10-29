import type { Socket } from "socket.io";
import { SOCKET_EVENTS } from "../socket.events.js";

export const registerSocketHandlers = (socket: Socket): void => {
  socket.on(SOCKET_EVENTS.PING, (payload: unknown) => {
    socket.emit(SOCKET_EVENTS.PONG, {
      success: true,
      message: "Pong from InfraPulse backend",
      received: payload,
      timestamp: new Date().toISOString(),
    });
  });
};
