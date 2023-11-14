import { EachMessagePayload } from "kafkajs";

import isInEnum from "../../util/isInEnum";
import kafka from "../kafka";
import MatchingTopics from "../topics/matching/matching";
import MatchingRequestTopics from "../topics/matchingRequest/topic";
import { ConsumerFunction } from "./main.interface";
import unsuccessfulMatchingConsumer from "./matching/failure";
import successfulMatchingConsumer from "./matching/success";
import createMatchingRequestConsumer from "./matchingRequest/create";

const MATCHING_TOPIC_MAPPER: Map<string, ConsumerFunction> = new Map([
  [MatchingTopics.CREATE, successfulMatchingConsumer],
]);

const MATCHING_REQUEST_TOPIC_MAPPER: Map<string, ConsumerFunction> = new Map([
  [MatchingRequestTopics.CREATE, createMatchingRequestConsumer],
  [MatchingRequestTopics.FAIL, unsuccessfulMatchingConsumer],
]);

const consumer = kafka.consumer({ groupId: "matching-service" });

const matchingEventConsumer = async () => {
  // first, we wait for the client to connect and subscribe to the given topic
  await consumer.connect();

  await consumer.subscribe({
    topics: Array.from(MATCHING_TOPIC_MAPPER.keys()).concat(
      Array.from(MATCHING_REQUEST_TOPIC_MAPPER.keys()),
    ),
  });

  await consumer.run({
    // this function is called every time the consumer gets a new message
    eachMessage: async ({ topic, message }: EachMessagePayload) => {
      // here, we just log the message to the standard output
      if (isInEnum(MatchingTopics, topic) && MATCHING_TOPIC_MAPPER.has(topic)) {
        await MATCHING_TOPIC_MAPPER.get(topic)!(message);
      }

      if (
        isInEnum(MatchingRequestTopics, topic) &&
        MATCHING_REQUEST_TOPIC_MAPPER.has(topic)
      ) {
        await MATCHING_REQUEST_TOPIC_MAPPER.get(topic)!(message);
      }
    },
  });
};

export default matchingEventConsumer;
