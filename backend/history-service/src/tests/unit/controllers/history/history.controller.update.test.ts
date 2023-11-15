import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import HistoryService from "../../../../services/history/history.service";
import HistoryParser from "../../../../parsers/history/history.parser";
import HistoryController from "../../../../controllers/history/history.controller";
import { History } from "../../../../interfaces/history/object";
import httpStatus from "http-status";
import { HistoryUpdateDTO } from "../../../../interfaces/history/updateDTO";

jest.mock("@prisma/client");
jest.mock("../../../../parsers/history/history.parser");
jest.mock("../../../../services/history/history.service");

const MockPrisma = jest.mocked(PrismaClient);
const MockHistoryService = jest.mocked(HistoryService);
const MockHistoryParser = jest.mocked(HistoryParser);

const MockPrismaInstance = new MockPrisma();
const MockHistoryParserInstance = new MockHistoryParser();
const MockHistoryServiceInstance = new MockHistoryService(MockPrismaInstance);

describe("Test History request controller", () => {
  beforeEach(() => {
    MockHistoryService.mockClear();
  });

  test("Health Check should be 200", () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );
    const expectedResponse = {
      success: true,
      errors: [],
      data: { message: "OK" },
    };

    controller.healthCheck(req, res);

    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  const updateInputAllFields: HistoryUpdateDTO = {
    language: "python",
    code: "print(hello world)",
  };

  const updateExpectedHistory: History = {
    ...updateInputAllFields,
    id: "qrstuvwxyz123",
    questionId: 1,
    user1Id: "abcdefg123456789",
    user2Id: "hijklmnop9876543",
    createdAt: new Date(),
  };

  // Update
  test("Controller-Service: Update History, Valid Input To Service -> Return Object", async () => {
    const testId: string = "qrstuvwxyz123";

    const serviceUpdateMethod = jest.spyOn(
      MockHistoryServiceInstance,
      "update"
    );

    serviceUpdateMethod.mockResolvedValue(updateExpectedHistory);

    const parserParseFindByIdInputMethod = jest.spyOn(
      MockHistoryParserInstance,
      "parseFindByIdInput"
    );

    const parserParseUpdateInputMethod = jest.spyOn(
      MockHistoryParserInstance,
      "parseUpdateInput"
    );

    parserParseFindByIdInputMethod.mockImplementation(() => testId);
    parserParseUpdateInputMethod.mockImplementation(() => updateInputAllFields);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );
    const expectedResponse = {
      success: true,
      errors: [],
      data: updateExpectedHistory,
    };

    await controller.update(req, res);

    expect(serviceUpdateMethod).toBeCalledWith(testId, updateInputAllFields);
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("Controller-Service: Update History, Invalid Input To Service -> Return Error", async () => {
    const serviceUpdateMethod = jest.spyOn(
      MockHistoryServiceInstance,
      "update"
    );

    serviceUpdateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );
    const expectedResponse = {
      success: false,
      errors: ["Service Error"],
      data: null,
    };
    await controller.update(req, res);

    expect(serviceUpdateMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("Controller-Parser: Update History, All Fields -> Test Pass Information to Parsers", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({
      body: updateInputAllFields,
    });

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );

    const parserParseMethod = jest.spyOn(
      MockHistoryParserInstance,
      "parseUpdateInput"
    );

    await controller.update(req, res);

    expect(parserParseMethod).toBeCalledWith(updateInputAllFields);
  });

  test("Controller-Parser: Update History, Parser Find By Input Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const parserParseMethod = jest.spyOn(
      MockHistoryParserInstance,
      "parseFindByIdInput"
    );

    parserParseMethod.mockImplementation(() => {
      throw new Error("Parser Error");
    });

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );
    const expectedResponse = {
      success: false,
      errors: ["Parser Error"],
      data: null,
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("Controller-Parser: Update History, Parser Update Input Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const parserParseMethod = jest.spyOn(
      MockHistoryParserInstance,
      "parseUpdateInput"
    );

    parserParseMethod.mockImplementation(() => {
      throw new Error("Parser Error");
    });

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );
    const expectedResponse = {
      success: false,
      errors: ["Parser Error"],
      data: null,
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  // Add test: "Controller: Create Question, Validation Schema Error -> Return Error"
});
