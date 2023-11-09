import { FullQuestionCreateDTO } from "../../interfaces/fullQuestion/createDTO";
import { FullQuestion } from "../../interfaces/fullQuestion/object";
import { FullQuestionUpdateDTO } from "../../interfaces/fullQuestion/updateDTO";

import { StringInterface } from "../../util/stringInterface";
import Parser from "../parser.interface";

class QuestionParser
  implements Parser<FullQuestionCreateDTO, FullQuestionUpdateDTO, FullQuestion>
{
  public parseCreateInput(
    input: StringInterface<FullQuestionCreateDTO>,
  ): FullQuestionCreateDTO {
    if (
      !input.title ||
      !input.content ||
      !input.authorId ||
      !input.difficulty
    ) {
      throw new Error("Invalid Input");
    }
    if (input.initialCodes.length == 0) {
      return input;
    }
    input.initialCodes.forEach((x) => {
      if (!x.code || !x.language) {
        throw new Error(
          "Required fields for question's initial code of code or language are missing",
        );
      }
    });
    if (input.runnerCodes.length == 0) {
      return input;
    }
    input.runnerCodes.forEach((x) => {
      if (!x.code || !x.language) {
        throw new Error(
          "Required fields for question's runner code of code or language are missing",
        );
      }
    });
    return input;
  }

  public parseFindByIdInput(id: string): number {
    if (!id) throw new Error("Invalid Input");
    return parseInt(id, 10);
  }

  public parseFindOneInput(
    input: Partial<StringInterface<FullQuestion>>,
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
    if (input.content) {
      parsedInput.content = input.content;
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
    return parsedInput;
  }

  public parseUpdateInput(
    input: Partial<StringInterface<FullQuestionUpdateDTO>>,
  ): Partial<FullQuestionUpdateDTO> {
    const parsedInput: Partial<FullQuestionUpdateDTO> = {};
    parsedInput.title = input.title;
    parsedInput.content = input.content;
    parsedInput.difficulty = input.difficulty;
    parsedInput.examples = input.examples;
    parsedInput.constraints = input.constraints;
    parsedInput.runnerCodes = input.runnerCodes;
    parsedInput.initialCodes = input.initialCodes;
    return parsedInput;
  }

  public parseDeleteInput(id: string): number {
    if (!id) throw new Error("Invalid Input");
    return parseInt(id, 10);
  }
}

export default QuestionParser;
