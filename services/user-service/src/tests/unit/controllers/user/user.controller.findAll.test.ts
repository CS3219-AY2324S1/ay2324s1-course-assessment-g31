import { getMockReq, getMockRes } from "@jest-mock/express";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import { Kafka } from "kafkajs";

import UserController from "../../../../controllers/user/user.controller";
import UserEventProducer from "../../../../events/producers/user/producer";
import { UserCreateDTO } from "../../../../interfaces/user/createDTO";
import { User } from "../../../../interfaces/user/object";
import { UserUpdateDTO } from "../../../../interfaces/user/updateDTO";
import UserParser from "../../../../parsers/user/user.parser";
import UserService from "../../../../services/user/user.service";

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
    name: "asd",
    roles: ["user"],
  };

  const createExpectedUser: User = {
    ...createInputAllFields,
    createdAt: new Date(),
    updatedAt: new Date(),
    questionsAuthored: 0,
  };

  const updateInputAllFields: UserUpdateDTO = {
    name: "asd",
    roles: ["admin"],
    questionsAuthored: 2,
  };

  const updateExpectedUser: User = {
    ...updateInputAllFields,
    id: "abc",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Find All
  test("Controller-Service: Find All User, Valid Input To Service -> Return Object", async () => {
    const expectedUsers = [createExpectedUser, updateExpectedUser];

    const serviceFindAllMethod = jest.spyOn(MockUserServiceInstance, "findAll");

    serviceFindAllMethod.mockResolvedValue(expectedUsers);

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );
    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toBeCalled();
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith(expectedUsers);
  });

  test("Controller-Service: Find All User, Invalid Input To Service -> Return Error", async () => {
    const serviceFindAllMethod = jest.spyOn(MockUserServiceInstance, "findAll");

    serviceFindAllMethod.mockImplementation(() => {
      throw new Error("Service Error");
    });

    const { res } = getMockRes({});
    const req = getMockReq({});

    const controller = new UserController(
      MockUserServiceInstance,
      MockUserParserInstance,
      MockUserEventProducerInstance,
    );
    await controller.findAll(req, res);

    expect(serviceFindAllMethod).toThrowError();
    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: "Service Error",
      success: false,
    });
  });

  test("Controller: Find All User, Validation Schema Error -> Return Error", async () => {
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

    await controller.findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
  });
});
