import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import { IMatchingRequestCreateInput } from "../../interfaces/IMatching";
import MatchingEventProducer from "../../kafka/producer/producer";
import MatchingRequestParser from "../../parsers/matchingRequest/matchingRequest.parser";
import MatchingRequestService from "../../services/matchingRequest/matchingRequest.service";
import MatchingRequestController from "./matchingRequest.controller";

jest.mock("kafkajs");
jest.mock("@prisma/client");
jest.mock("../../kafka/producer/producer");
jest.mock("../../parser/matchingRequest/matchingRequest.parser");
jest.mock("../../services/matchingRequest/matchingRequest.service");

const mockService = jest.mocked(MatchingRequestService);
const mockPrisma = jest.mocked(PrismaClient);
const mockKafka = jest.mocked(Kafka);
const mockMatchingEventProducer = jest.mocked(MatchingEventProducer);
const mockMatchingRequestParser = jest.mocked(MatchingRequestParser);

const mockKafkaInstance = new mockKafka({
  brokers: ["localhost:9092"],
  clientId: "matching-service",
});
const mockMatchingEventProducerInstance = new mockMatchingEventProducer(
  mockKafkaInstance
);
const mockMatchingRequestParserInstance = new mockMatchingRequestParser();
const mockPrismaInstance = new mockPrisma();
const mockServiceInstance = new mockService(
  mockMatchingEventProducerInstance,
  mockPrismaInstance
);

describe("Test matching request controller", () => {
  beforeEach(() => {
    mockService.mockClear();
    mockMatchingEventProducer.mockClear();
  });

  test("Health Check should be 200", () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      mockServiceInstance,
      mockMatchingRequestParserInstance
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
      .spyOn(mockServiceInstance, "create")
      .mockResolvedValue(expectedMatchingRequest as any);

    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({ body: completedMatchingRequestInput });

    const controller = new MatchingRequestController(
      mockServiceInstance,
      mockMatchingRequestParserInstance
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
      .spyOn(mockServiceInstance, "create")
      .mockResolvedValue(expectedMatchingRequest as any);

    const controller = new MatchingRequestController(
      mockServiceInstance,
      mockMatchingRequestParserInstance
    );
    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequest);
  });

  test("Unhappy Path: Parser Error Create Matching Request should be 400", async () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      mockServiceInstance,
      mockMatchingRequestParserInstance
    );

    jest
      .spyOn(mockMatchingRequestParserInstance, "parseCreateInput")
      .mockImplementation(() => {
        throw new Error("Parser Error");
      });

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
