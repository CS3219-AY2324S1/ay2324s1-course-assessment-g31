import { Message, Producer } from "kafkajs";

abstract class EventProducer<Obj> {
  private producer: Producer;

  constructor(producer: Producer) {
    this.producer = producer;
  }

  sendEvent = async (topic: string, messages: Message[]): Promise<void> => {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic,
        messages,
      });
      await this.producer.disconnect();
    } catch (error) {
      await this.producer.disconnect();
    }
  };

  abstract create(object: Obj): void;
  abstract update(object: Obj): void;
  abstract delete(object: Obj): void;
}

export default EventProducer;
