import { Kafka, KafkaConfig } from "kafkajs";

const devKafkaConfig: KafkaConfig = {
  clientId: "my-app",
  brokers: ["broker:29092"],
};

const prodKafkaConfig: KafkaConfig = {
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER_URL!],
  connectionTimeout: 45000,
  // authenticationTimeout: 10000,
  // reauthenticationThreshold: 10000,
  ssl: true,
  sasl: {
    mechanism: "plain", // scram-sha-256 or scram-sha-512
    username: process.env.KAFKA_BROKER_USERNAME!,
    password: process.env.KAFKA_BROKER_PASSWORD!,
  },
};

const kafka = new Kafka(
  process.env.NODE_ENV === "production" ? prodKafkaConfig : devKafkaConfig,
);

export default kafka;
