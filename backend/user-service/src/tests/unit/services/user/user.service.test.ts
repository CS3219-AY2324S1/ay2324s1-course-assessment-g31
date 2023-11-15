import { describe, expect, jest, test } from "@jest/globals";

import { UserCreateDTO } from "../../../../interfaces/user/createDTO";
import { User } from "../../../../interfaces/user/object";
import { UserUpdateDTO } from "../../../../interfaces/user/updateDTO";
import UserService from "../../../../services/user/user.service";
import { prismaMock } from "../../../../util/prisma/singleton";

jest.mock("kafkajs");
jest.mock("@prisma/client");

describe("Test user service", () => {
  const expectedUser: User = {
    id: "abc123",
    username: "abc",
    createdAt: new Date(),
    updatedAt: new Date(),
    questionsAuthored: 1,
    roles: ["user"],
  };

  // Create
  test("Create User, Valid Input To Prisma -> Return Object", async () => {
    const input: UserCreateDTO = {
      id: "abc123",
      username: "abc",
      roles: ["user"],
    };

    const expectedUser: User = {
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsAuthored: 1,
    };

    prismaMock.user.create.mockResolvedValue(expectedUser);

    const service = new UserService(prismaMock);
    const result = await service.create(input);

    expect(result).toEqual(expectedUser);
  });

  // Find By Id
  test("Find By Id User, Valid Input To Prisma -> Return Object", async () => {
    const testId: string = "abc123";

    prismaMock.user.findUnique.mockResolvedValue(expectedUser);

    const service = new UserService(prismaMock);
    const result = await service.findById(testId);

    expect(result).toEqual(expectedUser);
  });

  // Find One
  test("Find One User, Valid Input To Prisma -> Return Object", async () => {
    prismaMock.user.findFirst.mockResolvedValue(expectedUser);

    const service = new UserService(prismaMock);
    const result = await service.findOne(expectedUser);

    expect(result).toEqual(expectedUser);
  });

  // Find All
  test("Find All User, Valid Input To Prisma -> Return Object", async () => {
    const expectedUser2: User = {
      id: "qwe123",
      username: "qwe",
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsAuthored: 0,
      roles: ["admin"],
    };

    const expectedUsers = [expectedUser, expectedUser2];

    prismaMock.user.findMany.mockResolvedValue(expectedUsers);

    const service = new UserService(prismaMock);
    const result = await service.findAll();

    expect(result).toEqual(expectedUsers);
  });

  // Update
  test("Update User, Valid Input To Prisma -> Return Object", async () => {
    const testId: string = "abc123";

    const input: UserUpdateDTO = {
      username: "abc",
      roles: ["user"],
      questionsAuthored: 1,
    };

    const expectedUser: User = {
      ...input,
      id: "abc123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.update.mockResolvedValue(expectedUser);

    const service = new UserService(prismaMock);
    const result = await service.update(testId, input);

    expect(result).toEqual(expectedUser);
  });

  // Delete
  test("Delete User, Valid Input To Prisma -> Return Object", async () => {
    const testId: string = "abc123";

    prismaMock.user.delete.mockResolvedValue(expectedUser);

    const service = new UserService(prismaMock);
    const result = await service.delete(testId);

    expect(result).toEqual(expectedUser);
  });
});
