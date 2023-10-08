import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import MatchingRequestEventProducer from "../../events/producers/matchingRequest/producer";
import { IMatchingRequestCreateInput } from "../../interfaces/IMatching";
import MatchingRequestParser from "../../parsers/matchingRequest/matchingRequest.parser";
import MatchingRequestService from "../../services/matchingRequest/matchingRequest.service";
import MatchingRequestController from "./matchingRequest.controller";

jest.mock("kafkajs");
jest.mock("@prisma/client");
jest.mock("../../events/producers/matchingRequest/producer");
jest.mock("../../parsers/matchingRequest/matchingRequest.parser");
jest.mock("../../services/matchingRequest/matchingRequest.service");

const MockRequestService = jest.mocked(MatchingRequestService);
const MockPrisma = jest.mocked(PrismaClient);
const MockKafka = jest.mocked(Kafka);
const MockMatchingRequestEventProducer = jest.mocked(
  MatchingRequestEventProducer,
);
const MockMatchingRequestParser = jest.mocked(MatchingRequestParser);

const MockKafkaInstance = new MockKafka({
  brokers: ["localhost:9092"],
  clientId: "matching-service",
});
const MockMatchingRequestEventProducerInstance =
  new MockMatchingRequestEventProducer(MockKafkaInstance.producer());
const MockMatchingRequestParserInstance = new MockMatchingRequestParser();
const MockPrismaInstance = new MockPrisma();
const MockMatchingRequestServiceInstance = new MockRequestService(
  MockMatchingRequestEventProducerInstance,
  MockPrismaInstance,
);

describe("Test matching request controller", () => {
  beforeEach(() => {
    MockRequestService.mockClear();
    MockMatchingRequestEventProducer.mockClear();
  });

  test("Health Check should be 200", () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
    );
    controller.healthCheck(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "OK" });
  });

  test("Happy Path: Complete Create Matching Request should be 200", async () => {
    const completedMatchingRequestInput: IMatchingRequestCreateInput = {
      userId: "123",
      questionId: 12,
      difficulty: "easy",
      dateRequested: new Date(),
    };

    const expectedMatchingRequest = {
      ...completedMatchingRequestInput,
      id: 1,
      success: false,
    };

    jest
      .spyOn(MockMatchingRequestServiceInstance, "create")
      .mockResolvedValue(expectedMatchingRequest as any);

    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({ body: completedMatchingRequestInput });

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
    );
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequest);
  });

  test("Happy Path: No Optional Create Matching Request should be 200", async () => {
    const completedMatchingRequestInput: IMatchingRequestCreateInput = {
      userId: "123",
      difficulty: "easy",
    };

    const expectedMatchingRequest = {
      ...completedMatchingRequestInput,
      id: 1,
      success: false,
    };

    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({ body: completedMatchingRequestInput });

    jest
      .spyOn(MockMatchingRequestServiceInstance, "create")
      .mockResolvedValue(expectedMatchingRequest as any);

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
    );
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequest);
  });

  test("Unhappy Path: Parser Error Create Matching Request should be 400", async () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
    );

    jest
      .spyOn(MockMatchingRequestParserInstance, "parseCreateInput")
      .mockImplementation(() => {
        throw new Error("Parser Error");
      });

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
