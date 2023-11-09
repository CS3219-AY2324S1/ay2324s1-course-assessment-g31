import { describe, expect, test } from "@jest/globals";
import { mockDeep } from "jest-mock-extended";
import { Producer } from "kafkajs";

import { FullQuestion } from "../../../../../interfaces/fullQuestion/object";
import QuestionTopics from "../../../../../events/topics/question";
import QuestionProducer from "../../../../../events/producers/question/producer";

const mockProducer = mockDeep<Producer>();

const obj: FullQuestion = {
  id: 1,
  title: "New Question",
  content: "This is the new question",
  authorId: "abc123",
  difficulty: "easy",
  examples: ["1,2,3"],
  constraints: ["No Constraints"],
  initialCodes: [{ language: "java", code: "hello world", questionId: 1 }],
  runnerCodes: [
    { language: "python", code: "def hello world():", questionId: 1 },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Test Question Event Producer", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  // Create Event
  test("Create Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new QuestionProducer(mockProducer);
    await eventProducer.create(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: obj.id.toString(),
          value: JSON.stringify(obj),
        },
      ],
      topic: QuestionTopics.CREATE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Update Event
  test("update Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new QuestionProducer(mockProducer);
    await eventProducer.update(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: obj.id.toString(),
          value: JSON.stringify(obj),
        },
      ],
      topic: QuestionTopics.UPDATE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Delete Event
  test("Delete Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new QuestionProducer(mockProducer);
    await eventProducer.delete(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: obj.id.toString(),
          value: JSON.stringify(obj),
        },
      ],
      topic: QuestionTopics.DELETE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });
});
