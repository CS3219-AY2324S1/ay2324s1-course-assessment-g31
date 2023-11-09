import { describe } from "@jest/globals";

import { FullQuestionUpdateDTO } from "../../../../interfaces/fullQuestion/updateDTO";
import { StringInterface } from "../../../../util/stringInterface";
import QuestionParser from "../../../../parsers/question/question.parser";

const allFieldsInput: StringInterface<FullQuestionUpdateDTO> = {
  title: "New Question",
  content: "This is the new question",
  difficulty: "easy",
  examples: ["1,2,3"],
  constraints: ["No Constraints"],
  initialCodes: [{ language: "java", code: "hello world" }],
  runnerCodes: [{ language: "python", code: "def hello world():" }],
};

describe("Test Question Parser Parse Update Input", () => {
  it("Parser - Parse Update Input: Valid Input -> Parsed Update Input", () => {
    const parser = new QuestionParser();

    const expectedOutput: FullQuestionUpdateDTO = {
      ...allFieldsInput,
    };

    expect(parser.parseUpdateInput(allFieldsInput)).toEqual(expectedOutput);
  });
});
