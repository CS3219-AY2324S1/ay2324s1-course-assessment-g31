import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import HistoryService from "../../../../services/history/history.service";
import HistoryParser from "../../../../parsers/history/history.parser";
import HistoryController from "../../../../controllers/history/history.controller";
import { History } from "../../../../interfaces/history/object";
import httpStatus from "http-status";
import { HistoryUpdateDTO } from "../../../../interfaces/history/updateDTO";
import { HistoryCreateDTO } from "../../../../interfaces/history/createDTO";

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

  const updateInputAllFields: HistoryUpdateDTO = {
    language: "java",
    code: "@override pubic static void hello world",
  };

  const updateExpectedHistory: History = {
    ...updateInputAllFields,
    id: "qrstuvwxyz123",
    questionId: 1,
    user1Id: "abcdefg123456789",
    user2Id: "hijklmnop9876543",
    createdAt: new Date(),
  };

  // Find All
  test("Controller-Service: Find All History, Valid Input To Service -> Return Object", async () => {
    const expectedHistories = [createExpectedHistory, updateExpectedHistory];

    const serviceFindAllMethod = jest.spyOn(
      MockHistoryServiceInstance,
      "findAll"
    );

    serviceFindAllMethod.mockResolvedValue(expectedHistories);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new HistoryController(
      MockHistoryServiceInstance,
      MockHistoryParserInstance
    );
    const expectedResponse = {
      success: true,
      errors: [],
      data: expectedHistories,
    };

    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  test("Controller-Service: Find All History, Invalid Input To Service -> Return Error", async () => {
    const serviceFindAllMethod = jest.spyOn(
      MockHistoryServiceInstance,
      "findAll"
    );

    serviceFindAllMethod.mockImplementation(() => {
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

    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  // Add Test: "Controller: Create History, Validation Schema Error -> Return Error"
});
