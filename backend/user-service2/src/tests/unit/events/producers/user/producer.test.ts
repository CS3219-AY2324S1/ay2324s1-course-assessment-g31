import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { mockDeep } from "jest-mock-extended";
import { Producer } from "kafkajs";

import { User } from "../../../../../interfaces/user/object";
import UserTopics from "../../../../../events/topics/user";
import UserProducer from "../../../../../events/producers/user/producer";

const mockProducer = mockDeep<Producer>();

const obj: User = {
  id: "abc123",
  username: "abc",
  createdAt: new Date(),
  updatedAt: new Date(),
  questionsAuthored: 0,
  roles: ["user"],
};

describe("Test User Event Producer", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  // Create Event
  test("Create Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new UserProducer(mockProducer);
    await eventProducer.create(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: obj.id.toString(),
          value: JSON.stringify(obj),
        },
      ],
      topic: UserTopics.CREATE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Update Event
  test("update Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new UserProducer(mockProducer);
    await eventProducer.update(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: obj.id.toString(),
          value: JSON.stringify(obj),
        },
      ],
      topic: UserTopics.UPDATE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });

  // Delete Event
  test("Delete Event should call kafka methods", async () => {
    const producerConnectMethod = jest.spyOn(mockProducer, "connect");
    const producerSendMethod = jest.spyOn(mockProducer, "send");
    const producerDisconnectMethod = jest.spyOn(mockProducer, "connect");

    const eventProducer = new UserProducer(mockProducer);
    await eventProducer.delete(obj);
    expect(producerConnectMethod).toBeCalled();
    expect(producerSendMethod).toBeCalledWith({
      messages: [
        {
          key: obj.id.toString(),
          value: JSON.stringify(obj),
        },
      ],
      topic: UserTopics.DELETE,
    });
    expect(producerDisconnectMethod).toBeCalled();
  });
});
