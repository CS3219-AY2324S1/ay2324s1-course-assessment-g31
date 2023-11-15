import { describe } from "@jest/globals";

import QuestionParser from "../../../../parsers/question/question.parser";

describe("Test Question Parser Parse Find By Id Input", () => {
  it("Parser - Parse Find By Id Input: Valid Input -> Parsed Create Input", () => {
    const parser = new QuestionParser();

    const input: string = "1";

    const expectedOutput: number = 1;

    expect(parser.parseFindByIdInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find By Id Input: Invalid Input -> Parser Error", () => {
    const parser = new QuestionParser();

    const input = undefined;

    expect(() => parser.parseFindByIdInput(input as unknown as string)).toThrow(
      "Invalid Input",
    );
  });
});
