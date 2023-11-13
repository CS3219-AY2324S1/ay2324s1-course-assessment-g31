import { HistoryCreateDTO } from "../../../../interfaces/history/createDTO";
import HistoryParser from "../../../../parsers/history/history.parser";
import { StringInterface } from "../../../../util/stringInterface";

const allFieldsInput: StringInterface<HistoryCreateDTO> = {
  questionId: "369",
  user1Id: "123456789abcdefg",
  user2Id: "qrstuv9876543210",
  language: "python",
  code: "hello world",
};

describe("Test History Parser Parse Create Input", () => {
  it("Parser - Parse Create Input: Valid Input -> Parsed Create Input", () => {
    const parser = new HistoryParser();

    const expectedOutput: HistoryCreateDTO = {
      ...allFieldsInput,
      questionId: parseInt(allFieldsInput.questionId, 10),
    };

    expect(parser.parseCreateInput(allFieldsInput)).toEqual(expectedOutput);
  });

  it("Parser - Parse Create Input: Missing questionId Input -> Throw Error", () => {
    const parser = new HistoryParser();

    const { questionId, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<HistoryCreateDTO>
      )
    ).toThrow("Invalid Input");
  });
  it("Parser - Parse Create Input: Missing user1Id Input -> Throw Error", () => {
    const parser = new HistoryParser();

    const { user1Id, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<HistoryCreateDTO>
      )
    ).toThrow("Invalid Input");
  });

  it("Parser - Parse Create Input: Missing user2Id Input -> Throw Error", () => {
    const parser = new HistoryParser();

    const { user2Id, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<HistoryCreateDTO>
      )
    ).toThrow("Invalid Input");
  });

  it("Parser - Parse Create Input: Missing language Input -> Throw Error", () => {
    const parser = new HistoryParser();

    const { language, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<HistoryCreateDTO>
      )
    ).toThrow("Invalid Input");
  });

  it("Parser - Parse Create Input: Missing code Input -> Throw Error", () => {
    const parser = new HistoryParser();

    const { code, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<HistoryCreateDTO>
      )
    ).toThrow("Invalid Input");
  });
});
