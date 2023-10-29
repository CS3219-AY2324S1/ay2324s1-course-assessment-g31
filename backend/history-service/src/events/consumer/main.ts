import { EachMessagePayload } from "kafkajs";
import kafka from "../kafka";
import { ConsumerFunction } from "./main.interface";
import { sessionEndConsumer } from "./sessionEnd";
import SessionTopics from "../topics/topic";

const TOPIC_MAPPER: Map<string, ConsumerFunction> = new Map([
  [SessionTopics.END, sessionEndConsumer],
]);

const consumer = kafka.consumer({ groupId: "matching-service" });

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
