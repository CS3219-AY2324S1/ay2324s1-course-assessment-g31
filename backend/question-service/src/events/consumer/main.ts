import { EachMessagePayload } from "kafkajs";
import kafka from "../kafka";
import { ConsumerFunction } from "./main.interface";
import { sessionEndConsumer } from "./sessionEnd";
import { matchingCreatedConsumer } from "./matchingCreated";

export enum ConsumerTopics {
  COLLABORATION_ENDED = "collaboration-ended",
  MATCHING_CREATED = "matching-created",
}

const TOPIC_MAPPER: Map<string, ConsumerFunction> = new Map([
  [ConsumerTopics.COLLABORATION_ENDED, sessionEndConsumer],
  [ConsumerTopics.MATCHING_CREATED, matchingCreatedConsumer],
]);

const consumer = kafka.consumer({ groupId: "question-service" });

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

export default EventConsumer;
