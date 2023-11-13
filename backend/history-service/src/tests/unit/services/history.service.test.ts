import { HistoryCreateDTO } from "../../../interfaces/history/createDTO";
import { History } from "../../../interfaces/history/object";
import { HistoryUpdateDTO } from "../../../interfaces/history/updateDTO";
import HistoryService from "../../../services/history/history.service";
import { prismaMock } from "../../../util/prisma/singleton";

jest.mock("kafkajs");
jest.mock("@prisma/client");

const expectedHistory: History = {
  id: "abcdefg123",
  questionId: 1,
  user1Id: "hijklmnop456",
  user2Id: "qrstuv7890",
  language: "python",
  code: "hello world",
  createdAt: new Date(),
};

describe("Test History service", () => {
  // Create
  test("Create History, Valid Input To Prisma -> Return Object", async () => {
    const input: HistoryCreateDTO = {
      questionId: 1,
      user1Id: "hijklmnop456",
      user2Id: "qrstuv7890",
      language: "python",
      code: "hello world",
    };

    const expectedHistory: History = {
      ...input,
      id: "abcdefg123",
      createdAt: new Date(),
    };

    prismaMock.history.create.mockResolvedValue(expectedHistory);

    const service = new HistoryService(prismaMock);
    const result = await service.create(input);

    expect(result).toEqual(expectedHistory);
  });

  // Find By Id
  test("Find By Id History, Valid Input To Prisma -> Return Object", async () => {
    const testId: string = "abcdefg123";

    prismaMock.history.findUnique.mockResolvedValue(expectedHistory);

    const service = new HistoryService(prismaMock);
    const result = await service.findById(testId);

    expect(result).toEqual(expectedHistory);
  });

  // Find One
  test("Find One History, Valid Input To Prisma -> Return Object", async () => {
    prismaMock.history.findFirst.mockResolvedValue(expectedHistory);

    const service = new HistoryService(prismaMock);
    const result = await service.findOne(expectedHistory);

    expect(result).toEqual(expectedHistory);
  });

  // Find All
  test("Find All History, Valid Input To Prisma -> Return Object", async () => {
    const expectedHistory2: History = {
      id: "123456789abc",
      questionId: 1,
      user1Id: "aba923aba234",
      user2Id: "666kkkabc999",
      language: "javascript",
      code: 'console.log("hello world")',
      createdAt: new Date(),
    };

    const expectedHistories = [expectedHistory, expectedHistory2];

    prismaMock.history.findMany.mockResolvedValue(expectedHistories);

    const service = new HistoryService(prismaMock);
    const result = await service.findAll({});

    expect(result).toEqual(expectedHistories);
  });

  // Update
  test("Update History, Valid Input To Prisma -> Return Object", async () => {
    const testId: string = "oneoneone111";

    const input: HistoryUpdateDTO = {
      language: "java",
      code: "This is a line of code",
    };

    const expectedHistory: History = {
      ...input,
      id: "abcdefg123",
      questionId: 1,
      user1Id: "hijklmnop456",
      user2Id: "qrstuv7890",
      createdAt: new Date(),
    };

    prismaMock.history.update.mockResolvedValue(expectedHistory);

    const service = new HistoryService(prismaMock);
    const result = await service.update(testId, input);

    expect(result).toEqual(expectedHistory);
  });

  // Delete
  test("Delete History, Valid Input To Prisma -> Return Object", async () => {
    const testId: string = "twotwotwo222";

    prismaMock.history.delete.mockResolvedValue(expectedHistory);

    const service = new HistoryService(prismaMock);
    const result = await service.delete(testId);

    expect(result).toEqual(expectedHistory);
  });
});
