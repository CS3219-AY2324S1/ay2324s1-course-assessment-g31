import { Message, Partitioners, ProducerConfig } from "kafkajs";
import kafka from "./kafka";

export enum ProducerTopics {
  COLLABORATION_END = "collaboration-ended",
}

const producerConfig: ProducerConfig = {
  createPartitioner: Partitioners.LegacyPartitioner,
};

const producer = kafka.producer(producerConfig);

const produceEvent = async (
  topic: ProducerTopics,
  messages: Message[],
): Promise<void> => {
  await producer.connect();
  await producer.send({
    topic,
    messages,
  });
  //remove
  console.log(`Event Produced - Topic: ${topic}, ${messages}`);

  await producer.disconnect();
};

export default produceEvent;
