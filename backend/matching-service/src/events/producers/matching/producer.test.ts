import { describe, expect, test } from "@jest/globals";
import { mockDeep } from "jest-mock-extended";
import { Producer } from "kafkajs";

import { Matching } from "../../../interfaces/matching/object";
import MatchingProducer from "./producer";
import MatchingTopics from "../../topics/matching/matching";

const mockProducer = mockDeep<Producer>();

const obj: Matching = {
  id: 1,
  user1Id: "asd",
  user2Id: "zxc",
  requestId: 1,
  dateTimeMatched: new Date(),
};

describe("Test Matching Event Producer", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  // Create Event
  test("Create Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new MatchingProducer(mockProducer);
    await eventProducer.create(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: "1",
          value: JSON.stringify(obj),
        },
      ],
      topic: MatchingTopics.CREATE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Update Event
  test("update Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new MatchingProducer(mockProducer);
    await eventProducer.update(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: "1",
          value: JSON.stringify(obj),
        },
      ],
      topic: MatchingTopics.UPDATE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Delete Event
  test("Delete Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new MatchingProducer(mockProducer);
    await eventProducer.delete(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: "1",
          value: JSON.stringify(obj),
        },
      ],
      topic: MatchingTopics.DELETE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });
});
