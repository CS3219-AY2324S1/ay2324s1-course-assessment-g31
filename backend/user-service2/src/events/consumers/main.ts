import { EachMessagePayload } from "kafkajs";

import isInEnum from "../../util/isInEnum";
import kafka from "../kafka";
import QuestionTopics from "../topics/question";
import { ConsumerFunction } from "./main.interface";
import createQuestionConsumer from "./question/create";

const SubscribedQuestionTopics: Map<string, ConsumerFunction> = new Map([
  [QuestionTopics.CREATE, createQuestionConsumer],
]);

const consumer = kafka.consumer({ groupId: "user-service" });

const userEventConsumer = async () => {
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
        SubscribedQuestionTopics.get(topic)!(message);
      }
    },
  });
};

export default userEventConsumer;
