import { EachMessagePayload } from "kafkajs";

import isInEnum from "../../util/isInEnum";
import kafka from "../kafka";
import CollaborationTopics from "../topics/collaboration";
import QuestionTopics from "../topics/question";
import { ConsumerFunction } from "./main.interface";
import { matchingCreatedConsumer } from "./matchingCreated";
import { sessionEndConsumer } from "./sessionEnd";
import MatchingTopics from "../topics/matching";

const SubscribedQuestionTopics: Map<string, ConsumerFunction> = new Map([
  [CollaborationTopics.ENDED.toString(), sessionEndConsumer],
  [MatchingTopics.CREATE.toString(), matchingCreatedConsumer],
]);

const consumer = kafka.consumer({ groupId: "question-service" });

const questionEventConsumer = async () => {
  // first, we wait for the client to connect and subscribe to the given topic
  await consumer.connect();

  await consumer.subscribe({
    topics: Array.from(SubscribedQuestionTopics.keys()),
  });

  await consumer.run({
    // this function is called every time the consumer gets a new message
    eachMessage: async ({ topic, message }: EachMessagePayload) => {
      // here, we just log the message to the standard output
      if (
        isInEnum(QuestionTopics, topic) &&
        SubscribedQuestionTopics.has(topic)
      ) {
        await SubscribedQuestionTopics.get(topic)!(message);
      }
    },
  });
};

export default questionEventConsumer;
