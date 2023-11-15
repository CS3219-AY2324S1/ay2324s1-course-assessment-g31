import { describe } from "@jest/globals";

import UserParser from "../../../../parsers/user/user.parser";

describe("Test User Parser Parse Find By Id Input", () => {
  it("Parser - Parse Find By Id Input: Valid Input -> Parsed Create Input", () => {
    const parser = new UserParser();

    const input: string = "1";

    const expectedOutput: string = "1";

    expect(parser.parseFindByIdInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find By Id Input: Invalid Input -> Parser Error", () => {
    const parser = new UserParser();

    const input = undefined;

    expect(() => parser.parseFindByIdInput(input as unknown as string)).toThrow(
      "Invalid Input",
    );
  });
});
