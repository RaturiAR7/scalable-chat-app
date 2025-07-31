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
        socket.broadcast.emit("message-from-server", message,socket.id);
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
          const rooms = socket.rooms; // Set of rooms this socket is part of
          console.log("Room Message");
          // socket.rooms always includes the socket ID itself
          if (!rooms.has(roomId)) {
            console.log(
              `Socket ${socket.id} attempted to message room ${roomId} without joining`
            );
            socket.emit("error", `You are not part of room ${roomId}`);
            return;
          }

          console.log(roomId, " ", message);
          socket.to(roomId).emit("message-from-server", message,socket.id);
        }
      );
      ////Leave room
      socket.on("leave-room", ({ roomId }: { roomId: string }) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
      });
      /////Random Room-hardcoding the value of random room right now
      const randomRoom = "123";
      socket
        .on("join-room-random", () => {
          console.log(socket.id, "Join Room 123");
        })
        .join(randomRoom);
    });

    io.to("");
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
