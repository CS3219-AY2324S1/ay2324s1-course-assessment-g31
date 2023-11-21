import { EachMessagePayload } from "kafkajs";
import kafka from "../kafka";
import { ConsumerFunction } from "./main.interface";
import { sessionEndConsumer } from "./sessionEnd";
import { questionDeletedConsumer } from "./questionDeleted";

export enum ConsumerTopics {
  COLLABORATION_ENDED = "collaboration-ended",
  QUESTION_DELETED = "question-deleted",
}

const TOPIC_MAPPER: Map<string, ConsumerFunction> = new Map([
  [ConsumerTopics.COLLABORATION_ENDED, sessionEndConsumer],
  [ConsumerTopics.QUESTION_DELETED, questionDeletedConsumer],
]);

const consumer = kafka.consumer({ groupId: "history-service" });

const EventConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topics: Array.from(TOPIC_MAPPER.keys()),
  });

  await consumer.run({
    // this function is called every time the consumer gets a new message
    eachMessage: async ({ topic, message }: EachMessagePayload) => {
      if (TOPIC_MAPPER.has(topic)) {
        TOPIC_MAPPER.get(topic)!(message);
      }
    },
  });
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

export default EventConsumer;
