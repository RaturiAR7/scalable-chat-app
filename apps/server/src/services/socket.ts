import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import prismaClient from "./prisma";

require("dotenv").config();

console.log(process.env.REDIS_URL);
const pubClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
const subClient = pubClient.duplicate();

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: [
          "https://scalable-chat-app-web-gilt.vercel.app",
          "http://localhost:3000",
        ],
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
    /////Connection with socket
    io.on("connect", (socket) => {
      const userInfo = socket.handshake?.query?.userInfo;
      const userInfoParsed = JSON.parse(userInfo as string);
      console.log(userInfo, "Connected");

      //// Connect to a particular room (Private or Global)
      socket.on("join-room", async ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        ////Create Room If not created
        const room = await prismaClient.room.upsert({
          where: { id: roomId },
          update: {}, // do nothing if exists
          create: { id: roomId, name: `Room ${roomId}` },
        });
        console.log(
          `${userInfoParsed?.name} ${socket.id} joined room ${roomId}`
        );
        ////Create user
        const user = await prismaClient.user.upsert({
          where: { id: userInfoParsed.id },
          update: {},
          create: { id: userInfoParsed.id, name: userInfoParsed.name },
        });
        const messages = await prismaClient.message.findMany({
          where: { roomId },
          orderBy: { createdAt: "asc" }, // oldest first
          include: {
            sender: true, // so you can show who sent each message
          },
        });
        console.log(messages);
        ////Send old messages
        // messages.forEach((message) => {
        //   const userInfo = JSON.stringify({
        //     name: message.sender.name,
        //     id: message.senderId,
        //   });
        //   socket
        //     .to(roomId)
        //     .emit("message-from-server", message.text, userInfo, new Date());
        // });
        socket.emit(
          "previous-messages",
          messages.map((msg) => ({
            id: msg.id,
            text: msg.text,
            createdAt: msg.createdAt,
            sender: {
              id: msg.sender.id,
              name: msg.sender.name,
            },
          }))
        );
      });

      ///Message in particular room only
      socket.on(
        "event:room-message",
        async ({ roomId, message }: { roomId: string; message: string }) => {
          const rooms = socket.rooms; // Set of rooms this socket is part of
          console.log("Room Message", userInfoParsed?.name);
          // socket.rooms always includes the socket ID itself
          if (!rooms.has(roomId)) {
            console.log(
              `${userInfoParsed?.name} attempted to message room ${roomId} without joining`
            );
            socket.emit("error", `You are not part of room ${roomId}`);
            return;
          }
          socket
            .to(roomId)
            .emit("message-from-server", message, userInfo, new Date());

          ////Save message in db
          await prismaClient.message.create({
            data: {
              id: crypto.randomUUID(),
              text: message,
              roomId: roomId,
              senderId: userInfoParsed.id,
            },
          });
        }
      );

      ////Leave room
      socket.on("leave-room", ({ roomId }: { roomId: string }) => {
        socket.leave(roomId);
        console.log(`${userInfoParsed?.name} left room ${roomId}`);
      });
    });

    io.to("");
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
