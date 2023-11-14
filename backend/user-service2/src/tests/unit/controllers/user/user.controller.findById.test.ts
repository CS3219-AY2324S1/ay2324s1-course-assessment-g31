import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import UserEventProducer from "../../../../events/producers/user/producer";
import { UserCreateDTO } from "../../../../interfaces/user/createDTO";
import { User } from "../../../../interfaces/user/object";
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

  const createInputAllFields: UserCreateDTO = {
    id: "abc",
    username: "asd",
    roles: ["user"],
  };

  const createExpectedUser: User = {
    ...createInputAllFields,
    createdAt: new Date(),
    updatedAt: new Date(),
    questionsAuthored: 0,
  };

  // Find By Id
  test("Controller-Service: Find User By Id, Valid Input To Service -> Return Object", async () => {
    const testId: string = "1";

    const serviceFindByIdMethod = jest.spyOn(
      MockUserServiceInstance,
      "findById",
    );

    serviceFindByIdMethod.mockResolvedValue(createExpectedUser);

    const { res } = getMockRes({});
    const req = getMockReq({
      params: {
        id: testId,
      },
    });

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );
    await controller.findById(req, res);

    expect(serviceFindByIdMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(createExpectedUser);
  });

  test("Controller-Service: Find User By Id, Invalid Input To Service -> Return Error", async () => {
    const serviceFindByIdMethod = jest.spyOn(
      MockUserServiceInstance,
      "findById",
    );

    serviceFindByIdMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );
    await controller.findById(req, res);

    expect(serviceFindByIdMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Service: Find User By Id, No User Found -> Create User", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const expectedUser: User = {
      id: "abc123",
      username: "abc",
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsAuthored: 0,
      roles: ["users"],
    };
    const serviceFindByIdMethod = jest.spyOn(
      MockUserServiceInstance,
      "findById",
    );

    const serviceCreateMethod = jest.spyOn(MockUserServiceInstance, "create");

    serviceFindByIdMethod.mockResolvedValue(null);
    serviceCreateMethod.mockResolvedValue(expectedUser);

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );

    await controller.findById(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedUser);
  });

  test("Controller-Service: Find User By Id, No User Found -> Create User, Create Error -> Return Error", async () => {
    const { res } = getMockRes({});
    const req = getMockReq({});

    const expectedUser: User = {
      id: "abc123",
      username: "abc",
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsAuthored: 0,
      roles: ["users"],
    };
    const serviceFindByIdMethod = jest.spyOn(
      MockUserServiceInstance,
      "findById",
    );

    const serviceCreateMethod = jest.spyOn(MockUserServiceInstance, "create");

    serviceFindByIdMethod.mockResolvedValue(null);
    serviceCreateMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );

    await controller.findById(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller-Parser: Find User By Id, All Fields -> Test Pass Information to Parser", async () => {
    const testId: string = "1";
    const { res } = getMockRes({});
    const req = getMockReq({
      params: {
        id: testId,
      },
    });

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );

    const parserParseMethod = jest.spyOn(
      MockUserParserInstance,
      "parseFindByIdInput",
    );

    await controller.findById(req, res);

    expect(parserParseMethod).toBeCalledWith(testId);
  });

  test("Controller-Parser: Find User By Id, Invalid Input To Parser -> Return Error", async () => {
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

    await controller.findById(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Parser Error",
      success: false,
    });
  });

  test("Controller: Find User By Id, Validation Schema Error -> Return Error", async () => {
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

    await controller.findById(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
