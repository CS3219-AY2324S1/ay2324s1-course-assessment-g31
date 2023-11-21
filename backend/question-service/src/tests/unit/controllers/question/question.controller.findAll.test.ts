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
      data: {
        count: 0,
        data: "OK",
      },
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
    popularity: 1,
    categories: [{ name: "Non Strings" }],
    solutions: [
      {
        id: "1",
        title: "Question 2",
        description: "This is the question solution",
        language: "python",
        code: "print('hello world')",
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

    categories: updateInputAllFields.categories.map((x) => ({
      ...x,
      questionId: 1,
    })),
    solutions: updateInputAllFields.solutions.map((x) => ({
      ...x,
      questionId: 1,
    })),
    popularity: 1,
  };

  // Find All
  test("Controller-Service: Find All Question, Valid Input To Service -> Return Object", async () => {
    const expectedQuestions = [createExpectedQuestion, updateExpectedQuestion];

    const serviceFindAllMethod = jest.spyOn(
      MockQuestionServiceInstance,
      "findAll"
    );

    serviceFindAllMethod.mockResolvedValue({
      data: expectedQuestions,
      count: 1,
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance
    );
    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: { count: 1, data: expectedQuestions },
      errors: [],
      success: true,
    });
  });

  test("Controller-Service: Find All Question, Invalid Input To Service -> Return Error", async () => {
    const serviceFindAllMethod = jest.spyOn(
      MockQuestionServiceInstance,
      "findAll"
    );

    serviceFindAllMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance
    );
    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      errors: ["Service Error"],
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

    await controller.findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
