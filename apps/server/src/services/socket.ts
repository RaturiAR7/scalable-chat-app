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
      console.log(`New socket connected: ${socket.id}`);
      socket.on("event:message", ({ message }: { message: string }) => {
        io.emit("message-from-server", message);
      });
    });

    ////Room Connect
  }



  get io() {
    return this._io;
  }
}

export default SocketService;
