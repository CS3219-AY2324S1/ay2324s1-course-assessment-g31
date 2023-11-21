import { describe, expect, jest, test } from "@jest/globals";

import { FullQuestionCreateDTO } from "../../../../interfaces/fullQuestion/createDTO";
import { FullQuestion } from "../../../../interfaces/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../../../../interfaces/fullQuestion/updateDTO";
import QuestionService from "../../../../services/question/question.service";
import { prismaMock } from "../../../../util/prisma/singleton";

jest.mock("kafkajs");
jest.mock("@prisma/client");

describe("Test question service", () => {
  const expectedQuestion: FullQuestion = {
    id: 1,
    title: "New Question",
    description: "This is the new question",
    authorId: "abc123",
    difficulty: "easy",
    examples: ["1,2,3"],
    constraints: ["No Constraints"],
    initialCodes: [{ language: "java", code: "hello world", questionId: 1 }],
    runnerCodes: [
      { language: "python", code: "def hello world():", questionId: 1 },
    ],
    testCases: [
      {
        testCaseNumber: 1,
        input: "1",
        expectedOutput: ["1"],
        questionId: 1,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    popularity: 4,
    categories: [{ name: "Strings", questionId: 1 }],
    solutions: [
      {
        id: "1",
        title: "abc",
        description: "qwe",
        language: "java",
        code: "console.log();",
        questionId: 1,
      },
    ],
  };

  // Create
  test("Create Question, Valid Input To Prisma -> Return Object", async () => {
    const input: FullQuestionCreateDTO = {
      title: "New Question",
      description: "This is the new question",
      authorId: "abc123",
      difficulty: "easy",
      examples: ["1,2,3"],
      constraints: ["No Constraints"],
      initialCodes: [{ language: "java", code: "hello world" }],
      runnerCodes: [{ language: "python", code: "def hello world():" }],
      testCases: [
        {
          testCaseNumber: 1,
          input: "1",
          expectedOutput: ["1"],
        },
      ],
      categories: [{ name: "Strings" }],
      solutions: [
        {
          title: "abc",
          description: "qwe",
          language: "java",
          code: "console.log();",
        },
      ],
    };

    const expectedQuestion: FullQuestion = {
      ...input,
      authorId: "abc",
      id: 1,
      initialCodes: input.initialCodes.map((x) => ({ ...x, questionId: 1 })),
      runnerCodes: input.runnerCodes.map((x) => ({ ...x, questionId: 1 })),
      testCases: input.testCases.map((x) => ({ ...x, questionId: 1 })),
      createdAt: new Date(),
      updatedAt: new Date(),
      popularity: 4,
      solutions: input.solutions.map((x) => ({
        ...x,
        id: "123",
        questionId: 1,
      })),
      categories: input.categories.map((x) => ({ ...x, questionId: 1 })),
    };

    prismaMock.question.create.mockResolvedValue(expectedQuestion);

    const service = new QuestionService(prismaMock);
    const result = await service.create(input);

    expect(result.data).toEqual(expectedQuestion);
  });

  // Find By Id
  test("Find By Id Question, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;

    prismaMock.question.findUnique.mockResolvedValue(expectedQuestion);

    const service = new QuestionService(prismaMock);
    const result = await service.findById(testId);

    expect(result.data).toEqual(expectedQuestion);
  });

  // Find One
  test("Find One Question, Valid Input To Prisma -> Return Object", async () => {
    prismaMock.question.findFirst.mockResolvedValue(expectedQuestion);

    const service = new QuestionService(prismaMock);
    const result = await service.findOne(expectedQuestion);

    expect(result.data).toEqual(expectedQuestion);
  });

  // Find All
  test("Find All Question, Valid Input To Prisma -> Return Object", async () => {
    const expectedQuestion2: FullQuestion = {
      id: 2,
      title: "New Question 2",
      description: "This is the new question",
      authorId: "abc123",
      difficulty: "easy",
      examples: ["1,2,3"],
      constraints: ["No Constraints"],
      initialCodes: [{ language: "java", code: "hello world", questionId: 2 }],
      runnerCodes: [
        { language: "python", code: "def hello world():", questionId: 2 },
      ],
      testCases: [
        {
          testCaseNumber: 1,
          input: "3",
          expectedOutput: ["3"],
          questionId: 2,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      popularity: 4,
      categories: [{ name: "Strings", questionId: 2 }],
      solutions: [
        {
          id: "1",
          title: "abc",
          description: "qwe",
          language: "java",
          code: "console.log();",
          questionId: 2,
        },
      ],
    };

    const expectedQuestions = [expectedQuestion, expectedQuestion2];

    prismaMock.question.findMany.mockResolvedValue(expectedQuestions);

    const service = new QuestionService(prismaMock);
    const result = await service.findAll({});

    expect(result.data).toEqual(expectedQuestions);
  });

  // Update
  test("Update Question, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;

    const input: FullQuestionUpdateDTO = {
      title: "New Question",
      description: "This is the new question",
      difficulty: "easy",
      examples: ["1,2,3"],
      constraints: ["No Constraints"],
      initialCodes: [{ language: "java", code: "hello world" }],
      runnerCodes: [{ language: "python", code: "def hello world():" }],
      testCases: [
        {
          testCaseNumber: 1,
          input: "2",
          expectedOutput: ["2"],
        },
      ],
      popularity: 4,
      categories: [{ name: "Strings" }],
      solutions: [
        {
          id: "1",
          title: "abc",
          description: "qwe",
          language: "java",
          code: "console.log();",
        },
      ],
    };

    const expectedQuestion: FullQuestion = {
      ...input,
      authorId: "abc",
      id: 1,
      initialCodes: input.initialCodes.map((x) => ({ ...x, questionId: 1 })),
      runnerCodes: input.runnerCodes.map((x) => ({ ...x, questionId: 1 })),
      testCases: input.testCases.map((x) => ({ ...x, questionId: 1 })),
      solutions: input.solutions.map((x) => ({ ...x, questionId: 1 })),
      categories: input.categories.map((x) => ({ ...x, questionId: 1 })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.question.update.mockResolvedValue(expectedQuestion);

    const service = new QuestionService(prismaMock);
    const result = await service.update(testId, input);

    expect(result.data).toEqual(expectedQuestion);
  });

  // Delete
  test("Delete Question, Valid Input To Prisma -> Return Object", async () => {
    const testId: number = 1;

    prismaMock.question.delete.mockResolvedValue(expectedQuestion);

    const service = new QuestionService(prismaMock);
    const result = await service.delete(testId);

    expect(result.data).toEqual(expectedQuestion);
  });
});
