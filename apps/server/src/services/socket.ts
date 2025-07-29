import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "http://localhost:3000",
      },
    });

    // 💡 Connect clients and apply the adapter with a JSON parser
    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      this._io.adapter(
        createAdapter(pubClient, subClient, {
          parser: {
            encode: JSON.stringify,
            decode: JSON.parse,
          },
        })
      );
    });
  }

  public initListeners() {
    const io = this._io;
    ////Global Connect
    io.on("connect", (socket) => {
      console.log(socket.id, "Connected");
      socket.on("event:message", ({ message }: { message: string }) => {
        console.log("message", message);
        io.emit("message-from-server", message);
      });
      ////After global connect - Connect to a particular room
      socket.on("join-room", ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      });
      ///Message in particular room only
      socket.on(
        "event:room-message",
        ({ roomId, message }: { roomId: string; message: string }) => {
          console.log(roomId, " ", message);
          socket.to(roomId).emit(message);
          socket.emit("message-from-server-group", message);
        }
      );
      ////Leave room
      socket.on("leave-room", ({ roomId }: { roomId: string }) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
