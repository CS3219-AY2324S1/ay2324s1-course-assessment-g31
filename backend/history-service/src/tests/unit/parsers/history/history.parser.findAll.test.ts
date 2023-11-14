import { History } from "../../../../interfaces/history/object";
import HistoryParser from "../../../../parsers/history/history.parser";
import { StringInterface } from "../../../../util/stringInterface";

describe("Test History Parser Parse Find All Input", () => {
  it("Parser - Parse Find All Input: Invalid QuestionId Input -> Parser Error", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      questionId: "abcd",
    };

    expect(() => parser.parseFindAllInput(input)).toThrow("Invalid questionId");
  });

  it("Parser - Parse Find All Input: Empty Input -> Parsed Empty Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {};

    const expectedOutput: Partial<History> = {};

    expect(parser.parseFindAllInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find All Input: Valid Id Input -> Parsed Id Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      id: "abcdefg123",
    };

    const expectedOutput: Partial<History> = {
      id: "abcdefg123",
    };

    expect(parser.parseFindAllInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find All Input: Valid user1Id Input -> Parsed user1Id Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      user1Id: "abcdefg123",
    };

    const expectedOutput: Partial<History> = {
      user1Id: "abcdefg123",
    };

    expect(parser.parseFindAllInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find All Input: Valid user2Id Input -> Parsed user2Id Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      user2Id: "abcdefg123",
    };

    const expectedOutput: Partial<History> = {
      user2Id: "abcdefg123",
    };

    expect(parser.parseFindAllInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find All Input: Valid questionId Input -> Parsed questionId Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      questionId: "1",
    };

    const expectedOutput: Partial<History> = {
      questionId: 1,
    };

    expect(parser.parseFindAllInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find All Input: Valid language Input -> Parsed language Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      language: "python",
    };

    const expectedOutput: Partial<History> = {
      language: "python",
    };

    expect(parser.parseFindAllInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find All Input: Valid code Input -> Parsed code Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      code: "hello world",
    };

    const expectedOutput: Partial<History> = {
      code: "hello world",
    };

    expect(parser.parseFindAllInput(input)).toEqual(expectedOutput);
  });
});
