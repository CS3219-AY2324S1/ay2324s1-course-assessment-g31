import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import MatchingRequestEventProducer from "../../../../events/producers/matchingRequest/producer";
import { MatchingRequest } from "../../../../interfaces/matchingRequest/object";
import { MatchingRequestUpdateDTO } from "../../../../interfaces/matchingRequest/updateDTO";
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

  // Update
  test("Controller-Service: Update MatchingRequest, Valid Input To Service -> Return Object", async () => {
    const testId: number = 1;
    const input: MatchingRequestUpdateDTO = {
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      success: false,
    };

    const expectedMatchingRequest: MatchingRequest = {
      id: 1,
      dateRequested: new Date(),
      ...input,
    };

    const serviceUpdateMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "update",
    );

    serviceUpdateMethod.mockResolvedValue(expectedMatchingRequest);

    const eventProducerMethod = jest.spyOn(
      MockMatchingRequestEventProducerInstance,
      "update",
    );

    const parserParseFindByIdInputMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
      "parseFindByIdInput",
    );

    const parserParseUpdateInputMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
      "parseUpdateInput",
    );

    parserParseFindByIdInputMethod.mockImplementation(() => testId);
    parserParseUpdateInputMethod.mockImplementation(() => input);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.update(req, res);

    expect(serviceUpdateMethod).toBeCalledWith(testId, input);
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequest);
  });

  test("Controller-Service: Update MatchingRequest, Invalid Input To Service -> Return Error", async () => {
    const serviceUpdateMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "update",
    );

    serviceUpdateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.update(req, res);

    expect(serviceUpdateMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Update MatchingRequest, All Fields -> Test Pass Information to Parsers", async () => {
    const inputAllFields: MatchingRequestUpdateDTO = {
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      success: false,
    };
    const { res } = getMockRes({});
    const req = getMockReq({
      body: inputAllFields,
    });

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
      "parseUpdateInput",
    );

    await controller.update(req, res);

    expect(parserParseMethod).toBeCalledWith(inputAllFields);
  });

  test("Controller-Parser: Update MatchingRequest, Parser Find By Input Error -> Return Error", async () => {
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

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Parser Error",
      success: false,
    });
  });

  test("Controller-Parser: Update MatchingRequest, Parser Update Input Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
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

  test("Controller: Update Matching, Validation Schema Error -> Return Error", async () => {
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

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
