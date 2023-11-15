import { KafkaMessage } from "kafkajs";

export type ConsumerFunction = (message: KafkaMessage) => void;
