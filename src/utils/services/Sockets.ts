import { Server, Socket } from "socket.io";
import type { Server as HttpServer } from 'http'
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { green, red, redBright } from "colorette";
import { Logging } from "@/logs";

let socketIo: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export const InitScoketConnection = (server: HttpServer) => {
  Logging.dev("Socket are Initialized")
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_URL : "*",
    }
  })
  const infoNamespace = io.of('/info');
  infoNamespace.on('connection', (socket: Socket) => {

    socket.on('disconnect', () => {
      
    });

    socket.on("disconnecting", async (reason) => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
  });

  io.listen(server)
  socketIo = io
  return io
};

export const getSocketIo = () => socketIo
