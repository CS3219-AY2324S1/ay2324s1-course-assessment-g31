import { describe, expect, test } from "@jest/globals";
import { mockDeep } from "jest-mock-extended";
import { Producer } from "kafkajs";

import MatchingRequestProducer from "../../../../../events/producers/matchingRequest/producer";
import MatchingRequestTopics from "../../../../../events/topics/matchingRequest/topic";
import { MatchingRequest } from "../../../../../interfaces/matchingRequest/object";

const mockProducer = mockDeep<Producer>();

const obj: MatchingRequest = {
  id: 1,
  userId: "abc",
  questionId: 123,
  difficulty: "easy",
  dateRequested: new Date(),
  success: false,
};

describe("Test Matching Request Event Producer", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  // Create Event
  test("Create Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new MatchingRequestProducer(mockProducer);
    await eventProducer.create(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: "1",
          value: JSON.stringify(obj),
        },
      ],
      topic: MatchingRequestTopics.CREATE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Update Event
  test("update Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new MatchingRequestProducer(mockProducer);
    await eventProducer.update(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: "1",
          value: JSON.stringify(obj),
        },
      ],
      topic: MatchingRequestTopics.UPDATE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Delete Event
  test("Delete Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new MatchingRequestProducer(mockProducer);
    await eventProducer.delete(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: "1",
          value: JSON.stringify(obj),
        },
      ],
      topic: MatchingRequestTopics.DELETE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Fail Event
  test("Fail Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new MatchingRequestProducer(mockProducer);
    await eventProducer.fail(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: "1",
          value: JSON.stringify(obj),
        },
      ],
      topic: MatchingRequestTopics.FAIL,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });
});
