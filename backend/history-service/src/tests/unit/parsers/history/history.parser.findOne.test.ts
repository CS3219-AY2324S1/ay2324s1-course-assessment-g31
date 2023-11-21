import { History } from "../../../../interfaces/history/object";
import HistoryParser from "../../../../parsers/history/history.parser";
import { StringInterface } from "../../../../util/stringInterface";

describe("Test History Parser Parse Find One Input", () => {
  it("Parser - Parse Find One Input: No Input -> Parser Error", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {};

    expect(() => parser.parseFindOneInput(input)).toThrow("Invalid Input");
  });

  it("Parser - Parse Find One Input: Invalid QuestionId Input -> Parser Error", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      questionId: "abcd",
    };

    expect(() => parser.parseFindOneInput(input)).toThrow("Invalid questionId");
  });

  it("Parser - Parse Find One Input: Valid Id Input -> Parsed Id Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      id: "abcdefg123",
    };

    const expectedOutput: Partial<History> = {
      id: "abcdefg123",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid user1Id Input -> Parsed user1Id Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      user1Id: "abcdefg123",
    };

    const expectedOutput: Partial<History> = {
      user1Id: "abcdefg123",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid user2Id Input -> Parsed user2Id Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      user2Id: "abcdefg123",
    };

    const expectedOutput: Partial<History> = {
      user2Id: "abcdefg123",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid questionId Input -> Parsed questionId Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      questionId: "1",
    };

    const expectedOutput: Partial<History> = {
      questionId: 1,
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid language Input -> Parsed language Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      language: "python",
    };

    const expectedOutput: Partial<History> = {
      language: "python",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid code Input -> Parsed code Input", () => {
    const parser = new HistoryParser();

    const input: Partial<StringInterface<History>> = {
      code: "hello world",
    };

    const expectedOutput: Partial<History> = {
      code: "hello world",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });
});
