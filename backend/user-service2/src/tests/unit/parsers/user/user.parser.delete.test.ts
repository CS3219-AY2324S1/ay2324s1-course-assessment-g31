import { describe } from "@jest/globals";

import UserParser from "../../../../parsers/user/user.parser";

describe("Test User Parser Parse Delete Input", () => {
  it("Parser - Parse Delete Input: Valid Input -> Parsed Delete Input", () => {
    const parser = new UserParser();

    const input: string = "1";

    const expectedOutput: string = "1";

    expect(parser.parseDeleteInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Delete Input: Invalid Input -> Parser Error", () => {
    const parser = new UserParser();

    const input = undefined;

    expect(() => parser.parseDeleteInput(input as unknown as string)).toThrow(
      "Invalid Input",
    );
  });
});
