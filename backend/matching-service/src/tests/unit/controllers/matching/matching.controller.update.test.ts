import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import MatchingController from "../../../../controllers/matching/matching.controller";
import MatchingEventProducer from "../../../../events/producers/matching/producer";
import { Matching } from "../../../../interfaces/matching/object";
import { MatchingUpdateDTO } from "../../../../interfaces/matching/updateDTO";
import MatchingParser from "../../../../parsers/matching/matching.parser";
import MatchingService from "../../../../services/matching/matching.service";

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

  // Update
  test("Controller-Service: Update Matching, Valid Input To Service -> Return Object", async () => {
    const testId: number = 1;
    const input: MatchingUpdateDTO = {
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 123,
      difficulty: "easy",
      questionIdRequested: null,
    };

    const expectedMatching: Matching = {
      user1Id: input.user1Id,
      user2Id: input.user2Id,
      requestId: input.requestId,
      difficulty: input.difficulty,
      questionIdRequested: null,
      id: testId,
      dateTimeMatched: new Date(),
    };

    const serviceUpdateMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "update",
    );

    serviceUpdateMethod.mockResolvedValue(expectedMatching);

    const eventProducerMethod = jest.spyOn(
      MockMatchingEventProducerInstance,
      "update",
    );

    const parserParseFindByIdInputMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseFindByIdInput",
    );

    const parserParseUpdateInputMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseUpdateInput",
    );

    parserParseFindByIdInputMethod.mockImplementation(() => testId);
    parserParseUpdateInputMethod.mockImplementation(() => input);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.update(req, res);

    expect(serviceUpdateMethod).toBeCalledWith(testId, input);
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatching);
  });

  test("Controller-Service: Update Matching, Invalid Input To Service -> Return Error", async () => {
    const serviceUpdateMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "update",
    );

    serviceUpdateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.update(req, res);

    expect(serviceUpdateMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Update Matching, All Fields -> Test Pass Information to Parsers", async () => {
    const inputAllFields: MatchingUpdateDTO = {
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 123,
      difficulty: "easy",
      questionIdRequested: null,
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
      "parseUpdateInput",
    );

    await controller.update(req, res);

    expect(parserParseMethod).toBeCalledWith(inputAllFields);
  });

  test("Controller-Parser: Update Matching, Parser Find By Input Error -> Return Error", async () => {
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

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Parser Error",
      success: false,
    });
  });

  test("Controller-Parser: Update Matching, Parser Update Input Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseUpdateInput",
    );

    parserParseMethod.mockImplementation(() => {
      throw new Error("Parser Error");
    });

    await controller.update(req, res);

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

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
