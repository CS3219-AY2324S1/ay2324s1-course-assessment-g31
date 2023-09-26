import { describe } from "@jest/globals";
import MatchingRequestParser from "./matchingRequest.parser";

describe("Test matching request parser", () => {
  it("should parse create full input", () => {
    const parser = new MatchingRequestParser();

    const input = {
      userId: "123",
      questionId: "456",
      difficulty: "easy",
    };

    const expectedOutput = {
      userId: "123",
      questionId: 456,
      difficulty: "easy",
    };

    expect(parser.parseCreateInput(input)).toEqual(expectedOutput);
  });

  it("should parse create input with no optional fields", () => {
    const parser = new MatchingRequestParser();

    const input = {
      userId: "123",
      difficulty: "easy",
    };

    const expectedOutput = {
      userId: "123",
      difficulty: "easy",
    };

    expect(parser.parseCreateInput(input)).toEqual(expectedOutput);
  });
});
