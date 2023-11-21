import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import MatchingRequestEventProducer from "../../../../events/producers/matchingRequest/producer";
import { MatchingRequest } from "../../../../interfaces/matchingRequest/object";
import MatchingRequestParser from "../../../../parsers/matchingRequest/matchingRequest.parser";
import MatchingRequestService from "../../../../services/matchingRequest/matchingRequest.service";
import MatchingRequestController from "../../../../controllers/matchingRequest/matchingRequest.controller";

jest.mock("kafkajs");
jest.mock("@prisma/client");
jest.mock("../../../../events/producers/matchingRequest/producer");
jest.mock("../../../../parsers/matchingRequest/matchingRequest.parser");
jest.mock("../../../../services/matchingRequest/matchingRequest.service");

const MockMatchingRequestService = jest.mocked(MatchingRequestService);
const MockPrisma = jest.mocked(PrismaClient);
const MockKafka = jest.mocked(Kafka);
const MockMatchingRequestEventProducer = jest.mocked(
  MatchingRequestEventProducer,
);
const MockMatchingRequestParser = jest.mocked(MatchingRequestParser);

const MockKafkaInstance = new MockKafka({
  brokers: ["localhost:9092"],
  clientId: "matchingRequest-service",
});
const MockMatchingRequestEventProducerInstance =
  new MockMatchingRequestEventProducer(MockKafkaInstance.producer());
const MockMatchingRequestParserInstance = new MockMatchingRequestParser();
const MockPrismaInstance = new MockPrisma();
const MockMatchingRequestServiceInstance = new MockMatchingRequestService(
  MockPrismaInstance,
);

describe("Test matching request controller", () => {
  beforeEach(() => {
    MockMatchingRequestService.mockClear();
    MockMatchingRequestEventProducer.mockClear();
  });

  test("Health Check should be 200", () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    controller.healthCheck(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "OK" });
  });

  // Find By Id
  test("Controller-Service: Find MatchingRequest By Id, Valid Input To Service -> Return Object", async () => {
    const testId: string = "1";

    const expectedMatchingRequest: MatchingRequest = {
      id: 1,
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    const serviceFindByIdMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "findById",
    );

    serviceFindByIdMethod.mockResolvedValue(expectedMatchingRequest);

    const { res } = getMockRes({});
    const req = getMockReq({
      params: {
        id: testId,
      },
    });

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.findById(req, res);

    expect(serviceFindByIdMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequest);
  });

  test("Controller-Service: Find MatchingRequest By Id, Invalid Input To Service -> Return Error", async () => {
    const serviceFindByIdMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "findById",
    );

    serviceFindByIdMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.findById(req, res);

    expect(serviceFindByIdMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Find MatchingRequest By Id, All Fields -> Test Pass Information to Parser", async () => {
    const testId: string = "1";
    const { res } = getMockRes({});
    const req = getMockReq({
      params: {
        id: testId,
      },
    });

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
      "parseFindByIdInput",
    );

    await controller.findById(req, res);

    expect(parserParseMethod).toBeCalledWith(testId);
  });

  test("Controller-Parser: Find MatchingRequest By Id, Invalid Input To Parser -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
      "parseFindByIdInput",
    );

    parserParseMethod.mockImplementation(() => {
      throw new Error("Parser Error");
    });

    await controller.findById(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Parser Error",
      success: false,
    });
  });

  test("Controller: Find Matching Request By Id, Validation Schema Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({
      "express-validator#contexts": [
        {
          fields: ["matching1Id"],
          locations: ["body", "cookies", "headers", "params", "query"],
          stack: [
            { negated: false, message: "Matching id is required" },
            { negated: false, message: "Matching Id should be string" },
          ],
          optional: false,
          bail: false,
          _errors: [
            {
              type: "field",
              msg: "Matching id is required",
              path: "matching1Id",
              location: "body",
            },
            {
              type: "field",
              msg: "Matching Id should be string",
              path: "matching1Id",
              location: "body",
            },
          ],
          dataMap: {},
        },
        {
          fields: ["matching2Id"],
          locations: ["body", "cookies", "headers", "params", "query"],
          stack: [
            { negated: false, message: "Matching id is required" },
            { negated: false, message: "Matching Id should be string" },
          ],
          optional: false,
          bail: false,
          _errors: [
            {
              type: "field",
              msg: "Matching id is required",
              path: "matching2Id",
              location: "body",
            },
            {
              type: "field",
              msg: "Matching Id should be string",
              path: "matching2Id",
              location: "body",
            },
          ],
          dataMap: {},
        },
        {
          fields: ["dateTimeMatched"],
          locations: ["body", "cookies", "headers", "params", "query"],
          stack: [
            {
              negated: false,
              options: [null],
              message: "Date matched should be string",
            },
          ],
          optional: "undefined",
          bail: false,
          _errors: [],
          dataMap: {},
        },
      ],
    });

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );

    await controller.findById(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
