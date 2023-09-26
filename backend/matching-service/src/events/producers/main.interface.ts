import { Message, Producer } from "kafkajs";

export abstract class EventProducer<Object> {
  private producer: Producer;

  constructor(producer: Producer) {
    this.producer = producer;
  }

  sendEvent = async (topic: string, messages: Message[]): Promise<void> => {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages,
    });
    await this.producer.disconnect();
  };

  abstract create(object: Object): void;
  abstract update(object: Object): void;
  abstract delete(object: Object): void;
}
