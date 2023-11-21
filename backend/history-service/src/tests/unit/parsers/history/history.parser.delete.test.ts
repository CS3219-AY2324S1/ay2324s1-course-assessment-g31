import HistoryParser from "../../../../parsers/history/history.parser";

describe("Test History Parser Parse Delete Input", () => {
  it("Parser - Parse Delete Input: Valid Input -> Parsed Delete Input", () => {
    const parser = new HistoryParser();

    const input: string = "abcdefg123";

    const expectedOutput: string = "abcdefg123";

    expect(parser.parseDeleteInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Delete Input: Invalid Input -> Parser Error", () => {
    const parser = new HistoryParser();

    const input = undefined;

    expect(() => parser.parseDeleteInput(input as unknown as string)).toThrow(
      "Invalid Input"
    );
  });
});
