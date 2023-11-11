import { describe } from "@jest/globals";

import { FullQuestion } from "../../../../interfaces/fullQuestion/object";
import { StringInterface } from "../../../../util/stringInterface";
import QuestionParser from "../../../../parsers/question/question.parser";

describe("Test Question Parser Parse Find One Input", () => {
  it("Parser - Parse Find One Input: No Input -> Parser Error", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {};

    expect(() => parser.parseFindOneInput(input)).toThrow("Invalid Input");
  });

  it("Parser - Parse Find One Input: Valid Id Input -> Parsed Id Input", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {
      id: "1",
    };

    const expectedOutput: Partial<FullQuestion> = {
      id: 1,
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid title Input -> Parsed title Input", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {
      title: "title",
    };

    const expectedOutput: Partial<FullQuestion> = {
      title: "title",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid content Input -> Parsed content Input", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {
      content: "content",
    };

    const expectedOutput: Partial<FullQuestion> = {
      content: "content",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid difficulty Input -> Parsed difficulty Input", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {
      difficulty: "difficulty",
    };

    const expectedOutput: Partial<FullQuestion> = {
      difficulty: "difficulty",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid examples Input -> Parsed examples Input", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {
      examples: ["Example 1", "Example 2"],
    };

    const expectedOutput: Partial<FullQuestion> = {
      examples: ["Example 1", "Example 2"],
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid constraints Input -> Parsed constraints Input", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {
      constraints: ["Constraint 1", "Constraint 2"],
    };

    const expectedOutput: Partial<FullQuestion> = {
      constraints: ["Constraint 1", "Constraint 2"],
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid initialCodes Input -> Parsed initialCodes Input", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {
      id: "1",
      initialCodes: [
        {
          language: "java",
          code: "console.log('Hello World');",
          questionId: "1",
        },
      ],
    };

    const expectedOutput: Partial<FullQuestion> = {
      id: parseInt(input.id!, 10),
      initialCodes: [
        {
          language: "java",
          code: "console.log('Hello World');",
          questionId: 1,
        },
      ],
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid runnerCodes Input -> Parsed runnerCodes Input", () => {
    const parser = new QuestionParser();

    const input: Partial<StringInterface<FullQuestion>> = {
      id: "1",
      runnerCodes: [
        {
          language: "java",
          code: "console.log('Hello World');",
          questionId: "1",
        },
      ],
    };

    const expectedOutput: Partial<FullQuestion> = {
      id: parseInt(input.id!, 10),
      runnerCodes: [
        {
          language: "java",
          code: "console.log('Hello World');",
          questionId: 1,
        },
      ],
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });
});
