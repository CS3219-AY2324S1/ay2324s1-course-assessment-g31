import { KafkaMessage } from "kafkajs";

export type ConsumerFunction = (message: KafkaMessage) => Promise<void>;
