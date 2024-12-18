import { Server, Socket } from "socket.io";
import type { Server as HttpServer } from 'http'
import { Logging } from "@/logs";

let io: Server;
export const InitSocketConnection = () => {
  Logging.dev("Socket are Initialized")
  const io = new Server({
    cors: {
      origin: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_URL : "*",
    }
  })
  io.on('connection', (socket: Socket) => {

    socket.on('disconnect', () => {

    });

    socket.on("disconnecting", async (reason) => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
  });


  return io
};

io = InitSocketConnection()

export const getSocketIo = () => io

