import { describe, expect, jest, test } from "@jest/globals";

import { MatchingRequestCreateDTO } from "../../../../interfaces/matchingRequest/createDTO";
import { MatchingRequest } from "../../../../interfaces/matchingRequest/object";
import { MatchingRequestUpdateDTO } from "../../../../interfaces/matchingRequest/updateDTO";
import MatchingRequestService from "../../../../services/matchingRequest/matchingRequest.service";
import { prismaMock } from "../../../../util/prisma/singleton";

jest.mock("kafkajs");
jest.mock("@prisma/client");

describe("Test matching request service", () => {
  // Create
  test("Create Matching Request, Valid Input To Prisma -> Return Object", async () => {
    const input: MatchingRequestCreateDTO = {
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
    };

    const expectedMatchingRequest: MatchingRequest = {
      ...input,
      id: 1,
      questionId: input.questionId || null,
      dateRequested: new Date(),
      success: false,
    };

    prismaMock.matchingRequest.create.mockResolvedValue(
      expectedMatchingRequest,
    );

    const service = new MatchingRequestService(prismaMock);
    const result = await service.create(input);

    expect(result).toEqual(expectedMatchingRequest);
  });

  // Find By Id
  test("Find By Id Matching Request, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;
    const expectedMatchingRequest: MatchingRequest = {
      id: testId,
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    prismaMock.matchingRequest.findUnique.mockResolvedValue(
      expectedMatchingRequest,
    );

    const service = new MatchingRequestService(prismaMock);
    const result = await service.findById(testId);

    expect(result).toEqual(expectedMatchingRequest);
  });

  // Find One
  test("Find One Matching Request, Valid Input To Prisma -> Return Object", async () => {
    const expectedMatchingRequest: MatchingRequest = {
      id: 1,
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    prismaMock.matchingRequest.findFirst.mockResolvedValue(
      expectedMatchingRequest,
    );

    const service = new MatchingRequestService(prismaMock);
    const result = await service.findOne(expectedMatchingRequest);

    expect(result).toEqual(expectedMatchingRequest);
  });

  // Find All
  test("Find All Matching Request, Valid Input To Prisma -> Return Object", async () => {
    const expectedMatchingRequest1: MatchingRequest = {
      id: 1,
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    const expectedMatchingRequest2: MatchingRequest = {
      id: 2,
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    const expectedMatchingRequests = [
      expectedMatchingRequest1,
      expectedMatchingRequest2,
    ];

    prismaMock.matchingRequest.findMany.mockResolvedValue(
      expectedMatchingRequests,
    );

    const service = new MatchingRequestService(prismaMock);
    const result = await service.findAll();

    expect(result).toEqual(expectedMatchingRequests);
  });

  // Update
  test("Update Matching Request, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;

    const input: MatchingRequestUpdateDTO = {
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      success: false,
    };

    const expectedMatchingRequest: MatchingRequest = {
      ...input,
      id: 1,
      dateRequested: new Date(),
      success: false,
    };

    prismaMock.matchingRequest.update.mockResolvedValue(
      expectedMatchingRequest,
    );

    const service = new MatchingRequestService(prismaMock);
    const result = await service.update(testId, input);

    expect(result).toEqual(expectedMatchingRequest);
  });

  // Delete
  test("Delete Matching Request, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;

    const expectedMatchingRequest: MatchingRequest = {
      id: testId,
      userId: "abc",
      questionId: 123,
      difficulty: "easy",
      dateRequested: new Date(),
      success: false,
    };

    prismaMock.matchingRequest.delete.mockResolvedValue(
      expectedMatchingRequest,
    );

    const service = new MatchingRequestService(prismaMock);
    const result = await service.delete(testId);

    expect(result).toEqual(expectedMatchingRequest);
  });
});
