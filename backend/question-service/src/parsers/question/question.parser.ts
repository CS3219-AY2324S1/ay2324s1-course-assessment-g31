import { FullQuestionCreateDTO } from "../../interfaces/fullQuestion/createDTO";
import { FullQuestion } from "../../interfaces/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../../interfaces/fullQuestion/updateDTO";

import { StringInterface } from "../../util/stringInterface";
import Parser from "../parser.interface";

class QuestionParser
  implements Parser<FullQuestionCreateDTO, FullQuestionUpdateDTO, FullQuestion>
{
  public parseCreateInput(
    input: StringInterface<FullQuestionCreateDTO>
  ): FullQuestionCreateDTO {
    if (
      !input.title ||
      !input.description ||
      !input.authorId ||
      !input.difficulty
    ) {
      throw new Error("Invalid Input");
    }
    if (!input.testCases) {
      throw new Error("Test Cases field is required");
    }
    input.testCases.forEach((x) => {
      if (!x.testCaseNumber || !x.input || !x.expectedOutput) {
        throw new Error(
          "Required fields for question's test case of test case number or input or expected output are missing"
        );
      }
    });
    if (!input.initialCodes) {
      throw new Error("Initial Codes field is required");
    }
    input.initialCodes.forEach((x) => {
      if (!x.code || !x.language) {
        throw new Error(
          "Required fields for question's initial code of code or language are missing"
        );
      }
    });
    if (!input.runnerCodes) {
      throw new Error("Runner Codes field is required");
    }
    input.runnerCodes.forEach((x) => {
      if (!x.code || !x.language) {
        throw new Error(
          "Required fields for question's runner code of code or language are missing"
        );
      }
    });
    if (!input.solutions) {
      throw new Error("Solutions field is required");
    }
    input.solutions.forEach((x) => {
      if (!x.code || !x.language || !x.description || !x.title) {
        throw new Error(
          "Required fields for question's solution of code or language or description or title are missing"
        );
      }
    });
    if (!input.categories) {
      throw new Error("Categories field is required");
    }
    input.categories.forEach((x) => {
      if (!x.name) {
        throw new Error(
          "Required fields for question's categories of name are missing"
        );
      }
    });
    return {
      ...input,
      testCases: input.testCases.map((x) => ({
        ...x,
        testCaseNumber: parseInt(x.testCaseNumber, 10),
      })),
    };
  }

  public parseFindByIdInput(id: string): number {
    if (!id) throw new Error("Invalid Input");
    return parseInt(id, 10);
  }

  public parseFindOneInput(
    input: Partial<StringInterface<FullQuestion>>
  ): Partial<FullQuestion> {
    if (!input || Object.keys(input).length == 0)
      throw new Error("Invalid Input");
    const parsedInput: Partial<FullQuestion> = {};
    if (input.id) {
      parsedInput.id = input.id ? parseInt(input.id, 10) : undefined;
    }
    if (input.title) {
      parsedInput.title = input.title;
    }
    if (input.description) {
      parsedInput.description = input.description;
    }
    if (input.authorId) {
      parsedInput.authorId = input.authorId;
    }
    if (input.difficulty) {
      parsedInput.difficulty = input.difficulty;
    }
    if (input.examples) {
      parsedInput.examples = input.examples;
    }
    if (input.constraints) {
      parsedInput.constraints = input.constraints;
    }
    if (input.id && input.runnerCodes) {
      parsedInput.runnerCodes = input.runnerCodes.map((x) => ({
        ...x,
        questionId: parseInt(input.id!, 10),
      }));
    }
    if (input.id && input.initialCodes) {
      parsedInput.initialCodes = input.initialCodes.map((x) => ({
        ...x,
        questionId: parseInt(input.id!, 10),
      }));
    }
    if (input.id && input.testCases) {
      parsedInput.testCases = input.testCases.map((x) => ({
        ...x,
        testCaseNumber: parseInt(x.testCaseNumber, 10),
        questionId: parseInt(input.id!, 10),
      }));
    }
    if (input.id && input.solutions) {
      parsedInput.solutions = input.solutions.map((x) => ({
        ...x,
        questionId: parseInt(input.id!, 10),
      }));
    }
    if (input.id && input.categories) {
      parsedInput.categories = input.categories.map((x) => ({
        ...x,
        questionId: parseInt(input.id!, 10),
      }));
    }
    return parsedInput;
  }

  public parseUpdateInput(
    input: Partial<StringInterface<FullQuestionUpdateDTO>>
  ): Partial<FullQuestionUpdateDTO> {
    const parsedInput: Partial<FullQuestionUpdateDTO> = {};
    parsedInput.title = input.title;
    parsedInput.description = input.description;
    parsedInput.difficulty = input.difficulty;
    parsedInput.examples = input.examples;
    parsedInput.constraints = input.constraints;
    parsedInput.runnerCodes = input.runnerCodes;
    parsedInput.initialCodes = input.initialCodes;
    parsedInput.testCases = input.testCases?.map((x) => ({
      ...x,
      testCaseNumber: parseInt(x.testCaseNumber, 10),
    }));
    parsedInput.popularity = input.popularity
      ? parseInt(input.popularity)
      : undefined;
    parsedInput.solutions = input.solutions;
    parsedInput.categories = input.categories;
    return parsedInput;
  }

  public parseDeleteInput(id: string): number {
    if (!id) throw new Error("Invalid Input");
    return parseInt(id, 10);
  }
}

export default QuestionParser;
