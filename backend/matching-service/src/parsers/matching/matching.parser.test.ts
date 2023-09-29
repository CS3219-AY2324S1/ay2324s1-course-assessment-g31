import { describe } from "@jest/globals";
import MatchingParser from "./matching.parser";

describe("Test matching parser", () => {
  it("should parse create input", () => {
    const parser = new MatchingParser();

    const input = {
      user1Id: "123",
      user2Id: "456",
      requestId: "1",
    };

    const expectedOutput = {
      user1Id: "123",
      user2Id: "456",
      requestId: 1,
    };

    expect(parser.parseCreateInput(input)).toEqual(expectedOutput);
  });
});
