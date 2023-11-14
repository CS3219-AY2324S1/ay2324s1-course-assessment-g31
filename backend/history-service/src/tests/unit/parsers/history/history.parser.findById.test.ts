import HistoryParser from "../../../../parsers/history/history.parser";

describe("Test History Parser Parse Find By Id Input", () => {
  it("Parser - Parse Find By Id Input: Valid Input -> Parsed Create Input", () => {
    const parser = new HistoryParser();

    const input: string = "abcdefg123";

    const expectedOutput: string = "abcdefg123";

    expect(parser.parseFindByIdInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find By Id Input: Invalid Input -> Parser Error", () => {
    const parser = new HistoryParser();

    const input = undefined;

    expect(() => parser.parseFindByIdInput(input as unknown as string)).toThrow(
      "Invalid Input"
    );
  });
});
