import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import prismaClient from "./prisma";
// import { produceMessage } from "./kafka";

require("dotenv").config();

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
        origin: [`${process.env.FRONTEND_ORIGIN_URL}`, "http://localhost:3000"],
      },
      pingInterval: 25000,
      pingTimeout: 60000,
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

      //// Connect to a particular room (Private or Global)
      socket.on("join-room", async ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        ////Create Room If not created

        const room = await prismaClient.room.upsert({
          where: { id: roomId },
          update: {}, // do nothing if exists
          create: { id: roomId, name: `Room ${roomId}` },
        });

        ////Create user
        const user = await prismaClient.user.upsert({
          where: { id: userInfoParsed.id },
          update: {},
          create: {
            id: userInfoParsed.id,
            name: userInfoParsed.name,
            email: userInfoParsed.email,
            image: userInfoParsed.image,
          },
        });
        const messages = await prismaClient.message.findMany({
          where: { roomId },
          orderBy: { createdAt: "asc" }, // oldest first
          include: {
            sender: true, // so you can show who sent each message
          },
        });
        ////Send old messages
        socket.emit(
          "previous-messages",
          messages.map((msg) => ({
            id: msg.id,
            text: msg.text,
            createdAt: msg.createdAt,
            sender: {
              id: msg.sender.id,
              name: msg.sender.name,
              email: msg.sender.email,
              image: msg.sender.image,
            },
          }))
        );
      });
      /////typing indicator
      socket.on("typing-message", async (roomId: string, username: string) => {
        socket.to(roomId).emit("message-typing", username);
      });
      ///Message in particular room only
      socket.on(
        "event:room-message",
        async ({ roomId, message }: { roomId: string; message: string }) => {
          const rooms = socket.rooms; // Set of rooms this socket is part of
          // socket.rooms always includes the socket ID itself
          if (!rooms.has(roomId)) {
            socket.emit("error", `You are not part of room ${roomId}`);
            return;
          }
          socket
            .to(roomId)
            .emit("message-from-server", message, userInfo, new Date());

          ////Use Kafka producer consumer
          // await produceMessage(message, roomId, userInfoParsed);
          // console.log("Message produced to Kafka broker");
          /////for production as kafka not working directly insert into db
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
      });
    });

    io.to("");
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
