import { ConsumerSubscribeTopics, EachMessagePayload } from "kafkajs";
import { Server } from "socket.io";

import logger from "../util/logger";
import kafka from "./kafka";

const SubscribedTopics: ConsumerSubscribeTopics = {
  topics: ["matching-fulfilled"],
  fromBeginning: false,
};

const consumer = kafka.consumer({ groupId: "socket-service" });

const questionEventConsumer = async (io: Server) => {
  logger.info("Question Service Starting to Listen");
  // first, we wait for the client to connect and subscribe to the given topic

  try {
    await consumer.connect();
    await consumer.subscribe(SubscribedTopics);

    await consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        // here, we just log the message to the standard output
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

export default questionEventConsumer;
