import { io, Socket } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const socket: Socket = io("http://localhost:3000", {
    autoConnect: false,
    transports: ["websocket"],
  });

  return {
    provide: {
      socket,
    },
  };
});
