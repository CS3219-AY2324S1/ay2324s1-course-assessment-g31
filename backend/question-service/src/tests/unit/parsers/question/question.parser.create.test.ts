import { describe } from "@jest/globals";

import { FullQuestionCreateDTO } from "../../../../interfaces/fullQuestion/createDTO";
import { StringInterface } from "../../../../util/stringInterface";
import QuestionParser from "../../../../parsers/question/question.parser";

const allFieldsInput: StringInterface<FullQuestionCreateDTO> = {
  title: "New Question",
  description: "This is the new question",
  difficulty: "easy",
  examples: ["1,2,3"],
  constraints: ["No Constraints"],
  initialCodes: [{ language: "java", code: "hello world" }],
  runnerCodes: [{ language: "python", code: "def hello world():" }],
  testCases: [
    {
      testCaseNumber: "1",
      input: "2",
      expectedOutput: ["2"],
    },
  ],
  categories: [{ name: "Strings" }],
  solutions: [
    {
      title: "abc",
      description: "qwe",
      language: "java",
      code: "console.log();",
    },
  ],
  authorId: "abc123",
};

describe("Test Question Parser Parse Create Input", () => {
  it("Parser - Parse Create Input: Valid Input -> Parsed Create Input", () => {
    const parser = new QuestionParser();

    const expectedOutput: FullQuestionCreateDTO = {
      ...allFieldsInput,
      testCases: allFieldsInput.testCases.map((x) => ({
        ...x,
        testCaseNumber: parseInt(x.testCaseNumber, 10),
      })),
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

  it("Parser - Parse Create Input: Missing description Input -> Throw Error", () => {
    const parser = new QuestionParser();

    const { description, ...rest } = allFieldsInput;

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
