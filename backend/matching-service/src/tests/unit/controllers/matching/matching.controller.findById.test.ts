import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import MatchingEventProducer from "../../../../events/producers/matching/producer";
import { Matching } from "../../../../interfaces/matching/object";
import MatchingParser from "../../../../parsers/matching/matching.parser";
import MatchingService from "../../../../services/matching/matching.service";
import MatchingController from "../../../../controllers/matching/matching.controller";

jest.mock("kafkajs");
jest.mock("@prisma/client");
jest.mock("../../../../events/producers/matching/producer");
jest.mock("../../../../parsers/matching/matching.parser");
jest.mock("../../../../services/matching/matching.service");

const MockMatchingService = jest.mocked(MatchingService);
const MockPrisma = jest.mocked(PrismaClient);
const MockKafka = jest.mocked(Kafka);
const MockMatchingEventProducer = jest.mocked(MatchingEventProducer);
const MockMatchingParser = jest.mocked(MatchingParser);

const MockKafkaInstance = new MockKafka({
  brokers: ["localhost:9092"],
  clientId: "matching-service",
});
const MockMatchingEventProducerInstance = new MockMatchingEventProducer(
  MockKafkaInstance.producer(),
);
const MockMatchingParserInstance = new MockMatchingParser();
const MockPrismaInstance = new MockPrisma();
const MockMatchingServiceInstance = new MockMatchingService(MockPrismaInstance);

describe("Test matching request controller", () => {
  beforeEach(() => {
    MockMatchingService.mockClear();
    MockMatchingEventProducer.mockClear();
  });

  test("Health Check should be 200", () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    controller.healthCheck(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "OK" });
  });

  // Find By Id
  test("Controller-Service: Find Matching By Id, Valid Input To Service -> Return Object", async () => {
    const testId: string = "1";

    const expectedMatching: Matching = {
      id: 1,
      dateTimeMatched: new Date(),
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 123,
    };

    const serviceFindByIdMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "findById",
    );

    serviceFindByIdMethod.mockResolvedValue(expectedMatching);

    const { res } = getMockRes({});
    const req = getMockReq({
      params: {
        id: testId,
      },
    });

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.findById(req, res);

    expect(serviceFindByIdMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatching);
  });

  test("Controller-Service: Find Matching By Id, Invalid Input To Service -> Return Error", async () => {
    const serviceFindByIdMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "findById",
    );

    serviceFindByIdMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.findById(req, res);

    expect(serviceFindByIdMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Find Matching By Id, All Fields -> Test Pass Information to Parser", async () => {
    const testId: string = "1";
    const { res } = getMockRes({});
    const req = getMockReq({
      params: {
        id: testId,
      },
    });

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseFindByIdInput",
    );

    await controller.findById(req, res);

    expect(parserParseMethod).toBeCalledWith(testId);
  });

  test("Controller-Parser: Find Matching By Id, Invalid Input To Parser -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
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

  test("Controller: Create Matching, Validation Schema Error -> Return Error", async () => {
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

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );

    await controller.findById(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
