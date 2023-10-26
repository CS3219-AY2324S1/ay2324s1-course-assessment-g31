import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import MatchingEventProducer from "../../events/producers/matching/producer";
import { MatchingCreateDTO } from "../../interfaces/matching/createDTO";
import { Matching } from "../../interfaces/matching/object";
import { MatchingUpdateDTO } from "../../interfaces/matching/updateDTO";
import MatchingParser from "../../parsers/matching/matching.parser";
import MatchingService from "../../services/matching/matching.service";
import { StringInterface } from "../../util/stringInterface";
import MatchingController from "./matching.controller";

jest.mock("kafkajs");
jest.mock("@prisma/client");
jest.mock("../../events/producers/matching/producer");
jest.mock("../../parsers/matching/matching.parser");
jest.mock("../../services/matching/matching.service");

const MockRequestService = jest.mocked(MatchingService);
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
const MockMatchingServiceInstance = new MockRequestService(MockPrismaInstance);

describe("Test matching request controller", () => {
  beforeEach(() => {
    MockRequestService.mockClear();
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
    };

    const expectedMatching: Matching = {
      ...input,
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

  // Find One
  test("Controller-Service: Find One Matching, Valid Input To Service -> Return Object", async () => {
    const input: StringInterface<Matching> = {
      id: "1",
      user1Id: "abc",
      user2Id: "qwe",
      requestId: "123a",
      dateTimeMatched: "",
    };

    const expectedMatching: Matching = {
      id: 1,
      dateTimeMatched: new Date(),
      user1Id: input.user1Id,
      user2Id: input.user2Id,
      requestId: parseInt(input.requestId),
    };

    const serviceFindOneMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "findOne",
    );

    serviceFindOneMethod.mockResolvedValue(expectedMatching);

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseFindOneInput",
    );

    parserParseMethod.mockImplementation(() => expectedMatching);

    const { res } = getMockRes({});
    const req = getMockReq({
      body: input,
    });

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.findOne(req, res);

    expect(serviceFindOneMethod).toBeCalledWith(expectedMatching);
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatching);
  });

  test("Controller-Service: Find One Matching, Invalid Input To Service -> Return Error", async () => {
    const serviceFindOneMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "findOne",
    );

    serviceFindOneMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.findOne(req, res);

    expect(serviceFindOneMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Find One Matching, Invalid Input To Parser -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseFindOneInput",
    );

    parserParseMethod.mockImplementation(() => {
      throw new Error("Parser Error");
    });

    await controller.findOne(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Parser Error",
      success: false,
    });
  });

  // Find All
  test("Controller-Service: Find All Matching, Valid Input To Service -> Return Object", async () => {
    const expectedMatching1: Matching = {
      id: 1,
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 1,
      dateTimeMatched: new Date(),
    };

    const expectedMatching2: Matching = {
      id: 2,
      user1Id: "zxc",
      user2Id: "cvb",
      requestId: 2,
      dateTimeMatched: new Date(),
    };

    const expectedMatchings = [expectedMatching1, expectedMatching2];

    const serviceFindAllMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "findAll",
    );

    serviceFindAllMethod.mockResolvedValue(expectedMatchings);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchings);
  });

  test("Controller-Service: Find All Matching, Invalid Input To Service -> Return Error", async () => {
    const serviceFindAllMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "findAll",
    );

    serviceFindAllMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  // Update
  test("Controller-Service: Update Matching, Valid Input To Service -> Return Object", async () => {
    const testId: number = 1;
    const input: MatchingUpdateDTO = {
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 123,
    };

    const expectedMatching: Matching = {
      ...input,
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

  // Delete
  test("Controller-Service: Delete Matching, Valid Input To Service -> Return Object", async () => {
    const testId: string = "1";

    const expectedMatching: Matching = {
      id: parseInt(testId),
      dateTimeMatched: new Date(),
      user1Id: "abc",
      user2Id: "qwe",
      requestId: 123,
    };

    const serviceDeleteMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "delete",
    );

    serviceDeleteMethod.mockResolvedValue(expectedMatching);

    const eventProducerMethod = jest.spyOn(
      MockMatchingEventProducerInstance,
      "delete",
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingParserInstance,
      "parseFindByIdInput",
    );

    parserParseMethod.mockImplementation(() => parseInt(testId));

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
    await controller.delete(req, res);

    expect(serviceDeleteMethod).toBeCalledWith(parseInt(testId));
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatching);
  });

  test("Controller-Service: Delete Matching, Invalid Input To Service -> Return Error", async () => {
    const serviceDeleteMethod = jest.spyOn(
      MockMatchingServiceInstance,
      "delete",
    );

    serviceDeleteMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingController(
      MockMatchingServiceInstance,
      MockMatchingParserInstance,
      MockMatchingEventProducerInstance,
    );
    await controller.delete(req, res);

    expect(serviceDeleteMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Delete Matching, All Fields -> Test Pass Information to Parser", async () => {
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

    await controller.delete(req, res);

    expect(parserParseMethod).toBeCalledWith(testId);
  });

  test("Controller-Parser: Delete Matching, Invalid Input To Parser -> Return Error", async () => {
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

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Parser Error",
      success: false,
    });
  });
});
