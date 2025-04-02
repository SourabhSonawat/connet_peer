import io from "socket.io-client";

let socket;

export const createSocketConnection = () => {
  if (!socket) {
    socket = io("http://localhost:9002", {
      withCredentials: true,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
