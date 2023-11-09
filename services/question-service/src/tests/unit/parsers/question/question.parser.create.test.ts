import { describe } from "@jest/globals";

import { FullQuestionCreateDTO } from "../../../../interfaces/fullQuestion/createDTO";
import { StringInterface } from "../../../../util/stringInterface";
import QuestionParser from "../../../../parsers/question/question.parser";

const allFieldsInput: StringInterface<FullQuestionCreateDTO> = {
  title: "New Question",
  content: "This is the new question",
  authorId: "abc123",
  difficulty: "easy",
  examples: ["1,2,3"],
  constraints: ["No Constraints"],
  initialCodes: [{ language: "java", code: "hello world" }],
  runnerCodes: [{ language: "python", code: "def hello world():" }],
};

describe("Test Question Parser Parse Create Input", () => {
  it("Parser - Parse Create Input: Valid Input -> Parsed Create Input", () => {
    const parser = new QuestionParser();

    const expectedOutput: FullQuestionCreateDTO = {
      ...allFieldsInput,
    };

    expect(parser.parseCreateInput(allFieldsInput)).toEqual(expectedOutput);
  });

  it("Parser - Parse Create Input: Missing title Input -> Throw Error", () => {
    const parser = new QuestionParser();

    const { title, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<FullQuestionCreateDTO>,
      ),
    ).toThrow("Invalid Input");
  });

  it("Parser - Parse Create Input: Missing content Input -> Throw Error", () => {
    const parser = new QuestionParser();

    const { content, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<FullQuestionCreateDTO>,
      ),
    ).toThrow("Invalid Input");
  });

  it("Parser - Parse Create Input: Missing authorId Input -> Throw Error", () => {
    const parser = new QuestionParser();

    const { authorId, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<FullQuestionCreateDTO>,
      ),
    ).toThrow("Invalid Input");
  });

  it("Parser - Parse Create Input: Missing difficulty Input -> Throw Error", () => {
    const parser = new QuestionParser();

    const { difficulty, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<FullQuestionCreateDTO>,
      ),
    ).toThrow("Invalid Input");
  });
});
