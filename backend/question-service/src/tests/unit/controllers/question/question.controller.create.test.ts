import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import QuestionEventProducer from "../../../../events/producers/question/producer";
import { FullQuestionCreateDTO } from "../../../../interfaces/fullQuestion/createDTO";
import { FullQuestion } from "../../../../interfaces/fullQuestion/object";
import QuestionParser from "../../../../parsers/question/question.parser";
import QuestionService from "../../../../services/question/question.service";
import QuestionController from "../../../../controllers/question/question.controller";

jest.mock("kafkajs");
jest.mock("@prisma/client");
jest.mock("../../../../events/producers/question/producer");
jest.mock("../../../../parsers/question/question.parser");
jest.mock("../../../../services/question/question.service");

const MockQuestionService = jest.mocked(QuestionService);
const MockPrisma = jest.mocked(PrismaClient);
const MockKafka = jest.mocked(Kafka);
const MockQuestionEventProducer = jest.mocked(QuestionEventProducer);
const MockQuestionParser = jest.mocked(QuestionParser);

const MockKafkaInstance = new MockKafka({
  brokers: ["localhost:9092"],
  clientId: "question-service",
});
const MockQuestionEventProducerInstance = new MockQuestionEventProducer(
  MockKafkaInstance.producer()
);
const MockQuestionParserInstance = new MockQuestionParser();
const MockPrismaInstance = new MockPrisma();
const MockQuestionServiceInstance = new MockQuestionService(MockPrismaInstance);

describe("Test question request controller", () => {
  beforeEach(() => {
    MockQuestionService.mockClear();
    MockQuestionEventProducer.mockClear();
  });

  test("Health Check should be 200", () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance
    );
    controller.healthCheck(req, res);

    expect(res.json).toHaveBeenCalledWith({
      data: { count: 0, data: "OK" },
      errors: [],
      success: true,
    });
  });

  const createInputAllFields: FullQuestionCreateDTO = {
    title: "Question 1",
    description: "This is the question description",
    difficulty: "easy",
    categories: [{ name: "Strings" }],
    examples: ["1,2,3 = 6"],
    constraints: ["No constraints"],
    authorId: "abc",
    runnerCodes: [
      {
        language: "java",
        code: "hello world",
      },
    ],
    initialCodes: [
      {
        language: "python",
        code: "print('Hello Word')",
      },
    ],
    testCases: [
      {
        testCaseNumber: 1,
        input: "1",
        expectedOutput: ["1"],
      },
    ],
    solutions: [
      {
        title: "Question 1",
        description: "This is the question solution",
        language: "java",
        code: "hello world",
      },
    ],
  };

  const createExpectedQuestion: FullQuestion = {
    ...createInputAllFields,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    initialCodes: [
      {
        language: "java",
        code: "hello world",
        questionId: 1,
      },
    ],
    runnerCodes: [
      {
        language: "java",
        code: "hello world",
        questionId: 1,
      },
    ],
    testCases: [
      {
        testCaseNumber: 1,
        input: "1",
        expectedOutput: ["1"],
        questionId: 1,
      },
    ],
    categories: [{ questionId: 1, name: "Strings" }],
    popularity: 1,
    solutions: [
      {
        id: "1",
        title: "Question 1",
        description: "This is the question solution",
        language: "java",
        code: "hello world",
        questionId: 1,
      },
    ],
  };

  // Create
  test("Controller-Service: Create Question, Valid Input To Service -> Return Object", async () => {
    const serviceCreateMethod = jest.spyOn(
      MockQuestionServiceInstance,
      "create"
    );

    const eventProducerMethod = jest.spyOn(
      MockQuestionEventProducerInstance,
      "create"
    );

    serviceCreateMethod.mockResolvedValue({
      data: createExpectedQuestion,
      count: 1,
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance
    );
    await controller.create(req, res);

    const createExpectedQuestionRes = {
      data: { count: 1, data: createExpectedQuestion },
      errors: [],
      success: true,
    };

    expect(serviceCreateMethod).toBeCalled();
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(createExpectedQuestionRes);
  });

  test("Controller-Service: Create Question, Invalid Input To Service -> Return Error", async () => {
    const serviceCreateMethod = jest.spyOn(
      MockQuestionServiceInstance,
      "create"
    );

    serviceCreateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance
    );

    await controller.create(req, res);

    expect(serviceCreateMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      errors: ["Service Error"],
      success: false,
    });
  });

  test("Controller-Parser: Create Question, All Fields -> Test Pass Information to Parser", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({
      body: createInputAllFields,
    });

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance
    );

    const parserParseMethod = jest.spyOn(
      MockQuestionParserInstance,
      "parseCreateInput"
    );

    await controller.create(req, res);

    expect(parserParseMethod).toBeCalledWith(createInputAllFields);
  });

  test("Controller-Parser: Create Question, Invalid Input To Parser -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance
    );

    const parserParseMethod = jest.spyOn(
      MockQuestionParserInstance,
      "parseCreateInput"
    );

    parserParseMethod.mockImplementation(() => {
      throw new Error("Parser Error");
    });

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      errors: ["Parser Error"],
      success: false,
    });
  });

  test("Controller: Create Question, Validation Schema Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({
      "express-validator#contexts": [
        {
          fields: ["question1Id"],
          locations: ["body", "cookies", "headers", "params", "query"],
          stack: [
            { negated: false, message: "Question id is required" },
            { negated: false, message: "Question Id should be string" },
          ],
          optional: false,
          bail: false,
          _errors: [
            {
              type: "field",
              msg: "Question id is required",
              path: "question1Id",
              location: "body",
            },
            {
              type: "field",
              msg: "Question Id should be string",
              path: "question1Id",
              location: "body",
            },
          ],
          dataMap: {},
        },
        {
          fields: ["question2Id"],
          locations: ["body", "cookies", "headers", "params", "query"],
          stack: [
            { negated: false, message: "Question id is required" },
            { negated: false, message: "Question Id should be string" },
          ],
          optional: false,
          bail: false,
          _errors: [
            {
              type: "field",
              msg: "Question id is required",
              path: "question2Id",
              location: "body",
            },
            {
              type: "field",
              msg: "Question Id should be string",
              path: "question2Id",
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

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance
    );

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
