import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import MatchingEventProducer from "../../../../events/producers/matching/producer";
import { MatchingCreateDTO } from "../../../../interfaces/matching/createDTO";
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

  // Create
  test("Controller-Service: Create Matching, Valid Input To Service -> Return Object", async () => {
    const input: MatchingCreateDTO = {
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 123,
      difficulty: "easy",
      questionIdRequested: 1,
    };

    const expectedMatching: Matching = {
      ...input,
      questionIdRequested: input.questionIdRequested!,
      id: 1,
      dateTimeMatched: new Date(),
    };

    const serviceCreateMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "create",
    );

    const eventProducerMethod = jest.spyOn(
      MockMatchingEventProducerInstance,
      "create",
    );

    serviceCreateMethod.mockResolvedValue(expectedMatching);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.create(req, res);

    expect(serviceCreateMethod).toBeCalled();
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatching);
  });

  test("Controller-Service: Create Matching, Invalid Input To Service -> Return Error", async () => {
    const serviceCreateMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "create",
    );

    serviceCreateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.create(req, res);

    expect(serviceCreateMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Create Matching, All Fields -> Test Pass Information to Parser", async () => {
    const inputAllFields: MatchingCreateDTO = {
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 123,
      difficulty: "easy",
    };
    const { res } = getMockRes({});
    const req = getMockReq({
      body: inputAllFields,
    });

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseCreateInput",
    );

    await controller.create(req, res);

    expect(parserParseMethod).toBeCalledWith(inputAllFields);
  });

  test("Controller-Parser: Create Matching, All Required Fields -> Test Pass Information to Parser", async () => {
    const inputAllRequiredFields: MatchingCreateDTO = {
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 123,
      difficulty: "easy",
    };
    const { res } = getMockRes({});
    const req = getMockReq({
      body: inputAllRequiredFields,
    });

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseCreateInput",
    );

    await controller.create(req, res);

    expect(parserParseMethod).toBeCalledWith(inputAllRequiredFields);
  });

  test("Controller-Parser: Create Matching, Invalid Input To Parser -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseCreateInput",
    );

    parserParseMethod.mockImplementation(() => {
      throw new Error("Parser Error");
    });

    await controller.create(req, res);

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

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
