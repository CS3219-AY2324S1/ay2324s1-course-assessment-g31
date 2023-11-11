import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import QuestionEventProducer from "../../../../events/producers/question/producer";
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

  const updateInputAllFields: FullQuestionUpdateDTO = {
    title: "Question 2",
    content: "This is the question content edited",
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
    authorId: "abc123",
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

  // Update
  test("Controller-Service: Update Question, Valid Input To Service -> Return Object", async () => {
    const testId: number = 1;

    const serviceUpdateMethod = jest.spyOn(
      MockQuestionServiceInstance,
      "update",
    );

    serviceUpdateMethod.mockResolvedValue(updateExpectedQuestion);

    const eventProducerMethod = jest.spyOn(
      MockQuestionEventProducerInstance,
      "update",
    );

    const parserParseFindByIdInputMethod = jest.spyOn(
      MockQuestionParserInstance,
      "parseFindByIdInput",
    );

    const parserParseUpdateInputMethod = jest.spyOn(
      MockQuestionParserInstance,
      "parseUpdateInput",
    );

    parserParseFindByIdInputMethod.mockImplementation(() => testId);
    parserParseUpdateInputMethod.mockImplementation(() => updateInputAllFields);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance,
    );
    await controller.update(req, res);

    expect(serviceUpdateMethod).toBeCalledWith(testId, updateInputAllFields);
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(updateExpectedQuestion);
  });

  test("Controller-Service: Update Question, Invalid Input To Service -> Return Error", async () => {
    const serviceUpdateMethod = jest.spyOn(
      MockQuestionServiceInstance,
      "update",
    );

    serviceUpdateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance,
    );
    await controller.update(req, res);

    expect(serviceUpdateMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Update Question, All Fields -> Test Pass Information to Parsers", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({
      body: updateInputAllFields,
    });

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockQuestionParserInstance,
      "parseUpdateInput",
    );

    await controller.update(req, res);

    expect(parserParseMethod).toBeCalledWith(updateInputAllFields);
  });

  test("Controller-Parser: Update Question, Parser Find By Input Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockQuestionParserInstance,
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

  test("Controller-Parser: Update Question, Parser Update Input Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new QuestionController(
      MockQuestionServiceInstance,
      MockQuestionParserInstance,
      MockQuestionEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockQuestionParserInstance,
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

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
