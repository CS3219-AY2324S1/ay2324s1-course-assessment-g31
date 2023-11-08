import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import MatchingRequestEventProducer from "../../events/producers/matchingRequest/producer";
import { MatchingRequestCreateDTO } from "../../interfaces/matchingRequest/createDTO";
import { MatchingRequest } from "../../interfaces/matchingRequest/object";
import MatchingRequestParser from "../../parsers/matchingRequest/matchingRequest.parser";
import MatchingRequestService from "../../services/matchingRequest/matchingRequest.service";
import MatchingRequestController from "./matchingRequest.controller";
import { StringInterface } from "../../util/stringInterface";
import { MatchingRequestUpdateDTO } from "../../interfaces/matchingRequest/updateDTO";

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
  clientId: "matchingRequest-service",
});
const MockMatchingRequestEventProducerInstance =
  new MockMatchingRequestEventProducer(MockKafkaInstance.producer());
const MockMatchingRequestParserInstance = new MockMatchingRequestParser();
const MockPrismaInstance = new MockPrisma();
const MockMatchingRequestServiceInstance = new MockRequestService(
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
      MockMatchingRequestEventProducerInstance,
    );
    controller.healthCheck(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "OK" });
  });

  // Create
  test("Controller-Service: Create Matching Request, Valid Input To Service -> Return Object", async () => {
    const input: MatchingRequestCreateDTO = {
      userId: "abc",
      difficulty: "easy",
    };

    const expectedMatchingRequest: MatchingRequest = {
      id: 1,
      dateRequested: new Date(),
      success: false,
      userId: input.userId,
      questionId: input.questionId || null,
      difficulty: input.difficulty,
    };

    const serviceCreateMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "create",
    );

    const eventProducerMethod = jest.spyOn(
      MockMatchingRequestEventProducerInstance,
      "create",
    );

    serviceCreateMethod.mockResolvedValue(expectedMatchingRequest);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.create(req, res);

    expect(serviceCreateMethod).toBeCalled();
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequest);
  });

  test("Controller-Service: Create Matching Request, Invalid Input To Service -> Return Error", async () => {
    const serviceCreateMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "create",
    );

    serviceCreateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.create(req, res);

    expect(serviceCreateMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Create Matching Request, All Fields -> Test Pass Information to Parser", async () => {
    const inputAllFields: MatchingRequestCreateDTO = {
      userId: "abc",
      questionId: 1,
      difficulty: "easy",
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
      "parseCreateInput",
    );

    await controller.create(req, res);

    expect(parserParseMethod).toBeCalledWith(inputAllFields);
  });

  test("Controller-Parser: Create Matching Request, All Required Fields -> Test Pass Information to Parser", async () => {
    const inputAllRequiredFields: MatchingRequestCreateDTO = {
      userId: "abc",
      difficulty: "easy",
    };
    const { res } = getMockRes({});
    const req = getMockReq({
      body: inputAllRequiredFields,
    });

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
      "parseCreateInput",
    );

    await controller.create(req, res);

    expect(parserParseMethod).toBeCalledWith(inputAllRequiredFields);
  });

  test("Controller-Parser: Create Matching Request, Invalid Input To Parser -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
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

  // Find One
  test("Controller-Service: Find One MatchingRequest, Valid Input To Service -> Return Object", async () => {
    const input: StringInterface<MatchingRequest> = {
      id: "1",
      userId: "abc",
      questionId: "123",
      difficulty: "easy",
      dateRequested: new Date().toString(),
      success: "false",
    };

    const expectedMatchingRequest: MatchingRequest = {
      id: 1,
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    const serviceFindOneMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "findOne",
    );

    serviceFindOneMethod.mockResolvedValue(expectedMatchingRequest);

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
      "parseFindOneInput",
    );

    parserParseMethod.mockImplementation(() => expectedMatchingRequest);

    const { res } = getMockRes({});
    const req = getMockReq({
      body: input,
    });

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.findOne(req, res);

    expect(serviceFindOneMethod).toBeCalledWith(expectedMatchingRequest);
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequest);
  });

  test("Controller-Service: Find One MatchingRequest, Invalid Input To Service -> Return Error", async () => {
    const serviceFindOneMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "findOne",
    );

    serviceFindOneMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.findOne(req, res);

    expect(serviceFindOneMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Find One MatchingRequest, Invalid Input To Parser -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
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
  test("Controller-Service: Find All MatchingRequest, Valid Input To Service -> Return Object", async () => {
    const expectedMatchingRequest1: MatchingRequest = {
      id: 1,
      userId: "abc",
      questionId: 1,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    const expectedMatchingRequest2: MatchingRequest = {
      id: 2,
      userId: "qwe",
      questionId: 2,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    const expectedMatchingRequests = [
      expectedMatchingRequest1,
      expectedMatchingRequest2,
    ];

    const serviceFindAllMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "findAll",
    );

    serviceFindAllMethod.mockResolvedValue(expectedMatchingRequests);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequests);
  });

  test("Controller-Service: Find All MatchingRequest, Invalid Input To Service -> Return Error", async () => {
    const serviceFindAllMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "findAll",
    );

    serviceFindAllMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
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
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
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

  // Delete
  test("Controller-Service: Delete MatchingRequest, Valid Input To Service -> Return Object", async () => {
    const testId: string = "1";

    const expectedMatchingRequest: MatchingRequest = {
      id: parseInt(testId),
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    const serviceDeleteMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "delete",
    );

    serviceDeleteMethod.mockResolvedValue(expectedMatchingRequest);

    const eventProducerMethod = jest.spyOn(
      MockMatchingRequestEventProducerInstance,
      "delete",
    );

    const parserParseMethod = jest.spyOn(
      MockMatchingRequestParserInstance,
      "parseFindByIdInput",
    );

    parserParseMethod.mockImplementation(() => parseInt(testId));

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
    await controller.delete(req, res);

    expect(serviceDeleteMethod).toBeCalledWith(parseInt(testId));
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedMatchingRequest);
  });

  test("Controller-Service: Delete MatchingRequest, Invalid Input To Service -> Return Error", async () => {
    const serviceDeleteMethod = jest.spyOn(
      MockMatchingRequestServiceInstance,
      "delete",
    );

    serviceDeleteMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new MatchingRequestController(
      MockMatchingRequestServiceInstance,
      MockMatchingRequestParserInstance,
      MockMatchingRequestEventProducerInstance,
    );
    await controller.delete(req, res);

    expect(serviceDeleteMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Delete MatchingRequest, All Fields -> Test Pass Information to Parser", async () => {
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

    await controller.delete(req, res);

    expect(parserParseMethod).toBeCalledWith(testId);
  });

  test("Controller-Parser: Delete MatchingRequest, Invalid Input To Parser -> Return Error", async () => {
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

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Parser Error",
      success: false,
    });
  });
});

