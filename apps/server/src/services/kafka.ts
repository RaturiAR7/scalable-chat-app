import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";
const kafka = new Kafka({
  brokers: [process.env.KAFKA_HOST_URL!],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
    mechanism: "plain",
  },
});

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(
  message: string,
  roomId: string,
  userInfo: { name: string; image: string; id: string; email: string }
) {
  const producer = await createProducer();
  await producer.send({
    messages: [
      {
        key: `message-${Date.now()}`,
        value: JSON.stringify({ message, roomId, userInfo }),
      },
    ],
    topic: "MESSAGES",
  });
  return true;
}

export async function startMessageConsumer() {
  const consumer = await kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log(`New Message Received...`);
      try {
        const payLoad = JSON.parse(message.value.toString());
        console.log("Store in DB", payLoad);
        await prismaClient.message.create({
          data: {
            id: crypto.randomUUID(),
            text: payLoad.message,
            roomId: payLoad.roomId,
            senderId: payLoad.userInfo.id,
          },
        });
      } catch (error) {
        console.log("Something is wrong", error);
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

export default kafka;
