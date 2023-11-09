import { EachMessagePayload } from "kafkajs";
import { Server } from "socket.io";

import kafka from "./kafka";
import logger from "../util/logger";

const SOCKET_SUBSCRIBED_TOPICS: string[] = ["matching-created"];

const consumer = kafka.consumer({ groupId: "socket-service" });

const questionEventConsumer = async (io: Server) => {
  logger.info("Question Service Starting to Listen");
  // first, we wait for the client to connect and subscribe to the given topic
  await consumer.connect();

  SOCKET_SUBSCRIBED_TOPICS.forEach(async (topic) => {
    await consumer.subscribe({ topic });
  });

  await consumer.run({
    // this function is called every time the consumer gets a new message
    eachMessage: ({ topic, message }: EachMessagePayload) => {
      // here, we just log the message to the standard output
      io.emit(topic, message.value ? message.value.toString() : "");
      return Promise.resolve();
    },
  });
};

export default questionEventConsumer;
