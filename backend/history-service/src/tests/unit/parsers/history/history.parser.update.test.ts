import { HistoryUpdateDTO } from "../../../../interfaces/history/updateDTO";
import HistoryParser from "../../../../parsers/history/history.parser";
import { StringInterface } from "../../../../util/stringInterface";

const allFieldsInput: StringInterface<HistoryUpdateDTO> = {
  language: "python",
  code: "hello world",
};

describe("Test History Parser Parse Update Input", () => {
  it("Parser - Parse Update Input: Valid Input -> Parsed Update Input", () => {
    const parser = new HistoryParser();

    const expectedOutput: HistoryUpdateDTO = {
      ...allFieldsInput,
    };

    expect(parser.parseUpdateInput(allFieldsInput)).toEqual(expectedOutput);
  });
});
