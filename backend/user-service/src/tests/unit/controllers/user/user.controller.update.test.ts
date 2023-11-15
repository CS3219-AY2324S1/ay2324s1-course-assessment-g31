import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import UserEventProducer from "../../../../events/producers/user/producer";
import { User } from "../../../../interfaces/user/object";
import { UserUpdateDTO } from "../../../../interfaces/user/updateDTO";
import UserParser from "../../../../parsers/user/user.parser";
import UserService from "../../../../services/user/user.service";
import UserController from "../../../../controllers/user/user.controller";

jest.mock("kafkajs");
jest.mock("@prisma/client");
jest.mock("../../../../events/producers/user/producer");
jest.mock("../../../../parsers/user/user.parser");
jest.mock("../../../../services/user/user.service");

const MockUserService = jest.mocked(UserService);
const MockPrisma = jest.mocked(PrismaClient);
const MockKafka = jest.mocked(Kafka);
const MockUserEventProducer = jest.mocked(UserEventProducer);
const MockUserParser = jest.mocked(UserParser);

const MockKafkaInstance = new MockKafka({
  brokers: ["localhost:9092"],
  clientId: "user-service",
});
const MockUserEventProducerInstance = new MockUserEventProducer(
  MockKafkaInstance.producer(),
);
const MockUserParserInstance = new MockUserParser();
const MockPrismaInstance = new MockPrisma();
const MockUserServiceInstance = new MockUserService(MockPrismaInstance);

describe("Test user request controller", () => {
  beforeEach(() => {
    MockUserService.mockClear();
    MockUserEventProducer.mockClear();
  });

  test("Health Check should be 200", () => {
    const { res } = getMockRes({ locals: {} });
    const req = getMockReq({});

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );
    controller.healthCheck(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "OK" });
  });

  const updateInputAllFields: UserUpdateDTO = {
    username: "asd",
    roles: ["admin"],
    questionsAuthored: 2,
  };

  const updateExpectedUser: User = {
    ...updateInputAllFields,
    id: "abc",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Update
  test("Controller-Service: Update User, Valid Input To Service -> Return Object", async () => {
    const testId: string = "abc";

    const serviceUpdateMethod = jest.spyOn(MockUserServiceInstance, "update");

    serviceUpdateMethod.mockResolvedValue(updateExpectedUser);

    const eventProducerMethod = jest.spyOn(
      MockUserEventProducerInstance,
      "update",
    );

    const parserParseFindByIdInputMethod = jest.spyOn(
      MockUserParserInstance,
      "parseFindByIdInput",
    );

    const parserParseUpdateInputMethod = jest.spyOn(
      MockUserParserInstance,
      "parseUpdateInput",
    );

    parserParseFindByIdInputMethod.mockImplementation(() => testId);
    parserParseUpdateInputMethod.mockImplementation(() => updateInputAllFields);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );
    await controller.update(req, res);

    expect(serviceUpdateMethod).toBeCalledWith(testId, updateInputAllFields);
    expect(eventProducerMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(updateExpectedUser);
  });

  test("Controller-Service: Update User, Invalid Input To Service -> Return Error", async () => {
    const serviceUpdateMethod = jest.spyOn(MockUserServiceInstance, "update");

    serviceUpdateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );
    await controller.update(req, res);

    expect(serviceUpdateMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Update User, All Fields -> Test Pass Information to Parsers", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({
      body: updateInputAllFields,
    });

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockUserParserInstance,
      "parseUpdateInput",
    );

    await controller.update(req, res);

    expect(parserParseMethod).toBeCalledWith(updateInputAllFields);
  });

  test("Controller-Parser: Update User, Parser Find By Input Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockUserParserInstance,
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

  test("Controller-Parser: Update User, Parser Update Input Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockUserParserInstance,
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

  test("Controller: Update User, Validation Schema Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({
      "express-validator#contexts": [
        {
          fields: ["user1Id"],
          locations: ["body", "cookies", "headers", "params", "query"],
          stack: [
            { negated: false, message: "User id is required" },
            { negated: false, message: "User Id should be string" },
          ],
          optional: false,
          bail: false,
          _errors: [
            {
              type: "field",
              msg: "User id is required",
              path: "user1Id",
              location: "body",
            },
            {
              type: "field",
              msg: "User Id should be string",
              path: "user1Id",
              location: "body",
            },
          ],
          dataMap: {},
        },
        {
          fields: ["user2Id"],
          locations: ["body", "cookies", "headers", "params", "query"],
          stack: [
            { negated: false, message: "User id is required" },
            { negated: false, message: "User Id should be string" },
          ],
          optional: false,
          bail: false,
          _errors: [
            {
              type: "field",
              msg: "User id is required",
              path: "user2Id",
              location: "body",
            },
            {
              type: "field",
              msg: "User Id should be string",
              path: "user2Id",
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

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
