import { describe } from "@jest/globals";

import { FullQuestionUpdateDTO } from "../../../../interfaces/fullQuestion/updateDTO";
import { StringInterface } from "../../../../util/stringInterface";
import QuestionParser from "../../../../parsers/question/question.parser";

const allFieldsInput: StringInterface<FullQuestionUpdateDTO> = {
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
  popularity: "4",
  categories: [{ name: "Strings" }],
  solutions: [
    {
      id: "1",
      title: "abc",
      description: "qwe",
      language: "java",
      code: "console.log();",
    },
  ],
};

describe("Test Question Parser Parse Update Input", () => {
  it("Parser - Parse Update Input: Valid Input -> Parsed Update Input", () => {
    const parser = new QuestionParser();

    const expectedOutput: FullQuestionUpdateDTO = {
      ...allFieldsInput,
      popularity: parseInt(allFieldsInput.popularity),
      testCases: allFieldsInput.testCases.map((x) => ({
        ...x,
        testCaseNumber: parseInt(x.testCaseNumber, 10),
      })),
    };

    expect(parser.parseUpdateInput(allFieldsInput)).toEqual(expectedOutput);
  });
});
