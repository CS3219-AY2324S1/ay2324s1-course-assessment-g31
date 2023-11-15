import { Message, Partitioners } from "kafkajs";
import kafka from "../kafka";

export enum ProducerTopics {
  QUESTION_DELETED = "question-deleted",
  MATCHING_FULFILLED = "matching-fulfilled",
}

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const produceEvent = async (
  topic: ProducerTopics,
  messages: Message[]
): Promise<void> => {
  await producer.connect();
  await producer.send({
    topic,
    messages,
  });

  //remove
  console.log(`Event Produced - Topic: ${topic}`);
  await producer.disconnect();
};

export default produceEvent;
