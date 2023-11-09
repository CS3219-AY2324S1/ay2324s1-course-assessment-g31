import { describe, expect, jest, test } from "@jest/globals";

import { MatchingCreateDTO } from "../../interfaces/matching/createDTO";
import { Matching } from "../../interfaces/matching/object";
import MatchingService from "./matching.service";
import { prismaMock } from "../../util/prisma/singleton";
import { MatchingUpdateDTO } from "../../interfaces/matching/updateDTO";
import { MatchingRequest } from "../../interfaces/matchingRequest/object";

jest.mock("kafkajs");
jest.mock("@prisma/client");

describe("Test matching service", () => {
  // Create
  test("Create Matching, Valid Input To Prisma -> Return Object", async () => {
    const input: MatchingCreateDTO = {
        user1Id: "abc",
        user2Id: "qwe",
        requestId: 123,
        difficulty: "easy"
    };

    const expectedMatching: Matching = {
      ...input,
      questionIdRequested: null,
      id: 1,
      dateTimeMatched: new Date(),
    };

    prismaMock.matching.create.mockResolvedValue(expectedMatching);

    const service = new MatchingService(prismaMock);
    const result = await service.create(input);

    expect(result).toEqual(expectedMatching);
  });

  // Find By Id
  test("Find By Id Matching, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;
    const expectedMatching: Matching = {
        id: testId,
        user1Id: "asd",
        user2Id: "qwe",
        requestId: 1,
        dateTimeMatched: new Date(),
        difficulty: "easy",
        questionIdRequested: null
    };

    prismaMock.matching.findUnique.mockResolvedValue(expectedMatching);

    const service = new MatchingService(prismaMock);
    const result = await service.findById(testId);

    expect(result).toEqual(expectedMatching);
  });

  // Find One
  test("Find One Matching, Valid Input To Prisma -> Return Object", async () => {
    const expectedMatching: Matching = {
        id: 1,
        user1Id: "asd",
        user2Id: "qwe",
        requestId: 1,
        dateTimeMatched: new Date(),
        difficulty: "easy",
        questionIdRequested: null
    };

    prismaMock.matching.findFirst.mockResolvedValue(expectedMatching);

    const service = new MatchingService(prismaMock);
    const result = await service.findOne(expectedMatching);

    expect(result).toEqual(expectedMatching);
  });

  // Find All
  test("Find All Matching, Valid Input To Prisma -> Return Object", async () => {
    const expectedMatching1: Matching = {
        id: 1,
        user1Id: "asd",
        user2Id: "qwe",
        requestId: 1,
        dateTimeMatched: new Date(),
        difficulty: "easy",
        questionIdRequested: null
    };

    const expectedMatching2: Matching = {
        id: 2,
        user1Id: "zxc",
        user2Id: "asd",
        requestId: 2,
        dateTimeMatched: new Date(),
        difficulty: "easy",
        questionIdRequested: null
    };

    const expectedMatchings = [expectedMatching1, expectedMatching2];

    prismaMock.matching.findMany.mockResolvedValue(expectedMatchings);

    const service = new MatchingService(prismaMock);
    const result = await service.findAll();

    expect(result).toEqual(expectedMatchings);
  });

  // Update
  test("Update Matching, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;

    const input: MatchingUpdateDTO = {
        user1Id: "abc",
        user2Id: "qwe",
        requestId: 123,
        difficulty: ""
    };

    const expectedMatching: Matching = {
      ...input,
      questionIdRequested: null,
      id: testId,
      dateTimeMatched: new Date(),
    };

    prismaMock.matching.update.mockResolvedValue(expectedMatching);

    const service = new MatchingService(prismaMock);
    const result = await service.update(testId, input);

    expect(result).toEqual(expectedMatching);
  });

  // Delete
  test("Delete Matching, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;

    const expectedMatching: Matching = {
        id: testId,
        user1Id: "abc",
        user2Id: "qwe",
        requestId: 123,
        dateTimeMatched: new Date(),
        difficulty: "easy",
        questionIdRequested: null
    };

    prismaMock.matching.delete.mockResolvedValue(expectedMatching);

    const service = new MatchingService(prismaMock);
    const result = await service.delete(testId);

    expect(result).toEqual(expectedMatching);
  });

  // Find Match
  test("Find Match No Question Id, Valid Input To Prisma -> Return Object", async () => {
    const matching: MatchingRequest = {
      id: 1,
      userId: "asd",
      questionId: null,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    const expectedMatching: MatchingRequest = {
      id: 2,
      userId: "qwe",
      questionId: null,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    prismaMock.matchingRequest.findFirst.mockResolvedValue(expectedMatching);

    const service = new MatchingService(prismaMock);
    const result = await service.findMatch(matching);

    expect(result).toEqual(expectedMatching);
  });
});
