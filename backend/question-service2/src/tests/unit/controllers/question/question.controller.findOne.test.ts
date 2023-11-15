import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import QuestionEventProducer from "../../../../events/producers/question/producer";
import { FullQuestionCreateDTO } from "../../../../interfaces/fullQuestion/createDTO";
import { FullQuestion } from "../../../../interfaces/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../../../../interfaces/fullQuestion/updateDTO";
import QuestionParser from "../../../../parsers/question/question.parser";
import QuestionService from "../../../../services/question/question.service";
import stringify from "../../../../util/stringfy";
import { StringInterface } from "../../../../util/stringInterface";
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
  MockKafkaInstance.producer(),
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
      MockQuestionEventProducerInstance,
    );
    controller.healthCheck(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "OK" });
  });

  const createInputAllFields: FullQuestionCreateDTO = {
    title: "Question 1",
    description: "This is the question description",
    difficulty: "easy",
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
  };

  const updateInputAllFields: FullQuestionUpdateDTO = {
    title: "Question 2",
    description: "This is the question description edited",
    difficulty: "medium",
    examples: ["1,2,3 = 7"],
    constraints: ["Some constraints"],
    runnerCodes: [
      {
        language: "python",
        code: "console.log(hello world)",
      },
    ],
    initialCodes: [
      {
        language: "python",
        code: "def foo():",
      },
    ],
    testCases: [
      {
        testCaseNumber: 1,
        input: "2",
        expectedOutput: ["2"],
      },
    ],
  };

  const updateExpectedQuestion: FullQuestion = {
    ...updateInputAllFields,
    authorId: createInputAllFields.authorId,
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    runnerCodes: updateInputAllFields.runnerCodes.map((x) => ({
      ...x,
      questionId: 1,
    })),
    initialCodes: updateInputAllFields.initialCodes.map((x) => ({
      ...x,
      questionId: 1,
    })),
    testCases: updateInputAllFields.testCases.map((x) => ({
      ...x,
      questionId: 1,
    })),
  };

  // Find One
  test("Controller-Service: Find One Question, Valid Input To Service -> Return Object", async () => {
    const input: StringInterface<FullQuestion> = stringify(
      updateExpectedQuestion,
    );

    const serviceFindOneMethod = jest.spyOn(
      MockQuestionServiceInstance,
      "findOne",
    );

    serviceFindOneMethod.mockResolvedValue(createExpectedQuestion);

    const parserParseMethod = jest.spyOn(
      MockQuestionParserInstance,
      "parseFindOneInput",
    );

    parserParseMethod.mockImplementation(() => createExpectedQuestion);

    const { res } = getMockRes({});
    const req = getMockReq({
      body: input,
    });

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance,
    );
    await controller.findOne(req, res);

    expect(serviceFindOneMethod).toBeCalledWith(createExpectedQuestion);
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(createExpectedQuestion);
  });

  test("Controller-Service: Find One Question, Invalid Input To Service -> Return Error", async () => {
    const serviceFindOneMethod = jest.spyOn(
      MockQuestionServiceInstance,
      "findOne",
    );

    serviceFindOneMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance,
    );
    await controller.findOne(req, res);

    expect(serviceFindOneMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Find One Question, Invalid Input To Parser -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockQuestionParserInstance,
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
      MockQuestionEventProducerInstance,
    );

    await controller.findOne(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
