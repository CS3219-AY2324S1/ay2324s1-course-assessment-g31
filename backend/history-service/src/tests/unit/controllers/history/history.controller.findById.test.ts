import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import HistoryService from "../../../../services/history/history.service";
import HistoryParser from "../../../../parsers/history/history.parser";
import HistoryController from "../../../../controllers/history/history.controller";
import { HistoryCreateDTO } from "../../../../interfaces/history/createDTO";
import { History } from "../../../../interfaces/history/object";
import httpStatus from "http-status";

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

  const createInputAllFields: HistoryCreateDTO = {
    questionId: 1,
    user1Id: "abcdefg123456789",
    user2Id: "hijklmnop9876543",
    language: "python",
    code: "print(hello world)",
  };

  const createExpectedHistory: History = {
    ...createInputAllFields,
    id: "qrstuvwxyz123",
    createdAt: new Date(),
  };

  // Find By Id
  test("Controller-Service: Find History By Id, Valid Input To Service -> Return Object", async () => {
    const testId: string = "qrstuvwxyz123";

    const serviceFindByIdMethod = jest.spyOn(
      MockHistoryServiceInstance,
      "findById"
    );

    serviceFindByIdMethod.mockResolvedValue(createExpectedHistory);

    const { res } = getMockRes({});
    const req = getMockReq({
      params: {
        id: testId,
      },
    });

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );

    const expectedResponse = {
      success: true,
      errors: [],
      data: createExpectedHistory,
    };

    await controller.findById(req, res);

    expect(serviceFindByIdMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("Controller-Service: Find History By Id, Invalid Input To Service -> Return Error", async () => {
    const serviceFindByIdMethod = jest.spyOn(
      MockHistoryServiceInstance,
      "findById"
    );

    serviceFindByIdMethod.mockImplementation(() => {
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

    await controller.findById(req, res);

    expect(serviceFindByIdMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("Controller-Parser: Find History By Id, All Fields -> Test Pass Information to Parser", async () => {
    const testId: string = "qrstuvwxyz123";
    const { res } = getMockRes({});
    const req = getMockReq({
      params: {
        id: testId,
      },
    });

    const parserParseMethod = jest.spyOn(
      MockHistoryParserInstance,
      "parseFindByIdInput"
    );

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );

    await controller.findById(req, res);

    expect(parserParseMethod).toBeCalledWith(testId);
  });

  test("Controller-Parser: Find History By Id, Invalid Input To Parser -> Return Error", async () => {
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

    await controller.findById(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  // Add test: "Controller: Create Question, Validation Schema Error -> Return Error"
});
