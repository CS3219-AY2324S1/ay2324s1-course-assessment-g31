import { ConsumerSubscribeTopics, EachMessagePayload } from "kafkajs";
import { Server } from "socket.io";

import logger from "../util/logger";
import kafka from "./kafka";

import eventBus from "../util/eventBus";

const SubscribedTopics: ConsumerSubscribeTopics = {
  topics: ["matching-created"],
  fromBeginning: false,
};

const consumer = kafka.consumer({ groupId: "chat-service" });

const chatEventConsumer = async (io: Server) => {
  try {
    await consumer.connect();
    await consumer.subscribe(SubscribedTopics);

    await consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        logger.info("BELOW BY YUZE")
        logger.info(message.value);
        io.emit(topic, message.value ? message.value.toString() : "");
      },
    });
  } catch (error) {
    logger.error("Error: ", error);
  }
};

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

export default chatEventConsumer;
