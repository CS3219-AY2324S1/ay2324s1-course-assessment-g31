import { describe } from "@jest/globals";

import QuestionParser from "../../../../parsers/question/question.parser";

describe("Test Question Parser Parse Delete Input", () => {
  it("Parser - Parse Delete Input: Valid Input -> Parsed Delete Input", () => {
    const parser = new QuestionParser();

    const input: string = "1";

    const expectedOutput: number = 1;

    expect(parser.parseDeleteInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Delete Input: Invalid Input -> Parser Error", () => {
    const parser = new QuestionParser();

    const input = undefined;

    expect(() => parser.parseDeleteInput(input as unknown as string)).toThrow(
      "Invalid Input",
    );
  });
});
