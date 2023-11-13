import { HistoryCreateDTO } from "../../interfaces/history/createDTO";
import { History } from "../../interfaces/history/object";
import { HistoryUpdateDTO } from "../../interfaces/history/updateDTO";
import { StringInterface } from "../../util/stringInterface";
import Parser from "../parser.interface";

class HistoryParser
  implements Parser<HistoryCreateDTO, HistoryUpdateDTO, History>
{
  public parseCreateInput(
    input: StringInterface<HistoryCreateDTO>
  ): HistoryCreateDTO {
    if (
      !input.code ||
      !input.language ||
      !input.questionId ||
      !input.user1Id ||
      !input.user2Id
    ) {
      throw new Error("Invalid Input");
    }

    return {
      ...input,
      questionId: parseInt(input.questionId, 10),
    };
  }

  public parseFindByIdInput(id: string): string {
    if (!id) throw new Error("Invalid Input");
    return id;
  }

  public parseFindOneInput(
    input: Partial<StringInterface<History>>
  ): Partial<History> {
    if (!input || Object.keys(input).length == 0)
      throw new Error("Invalid Input");
    const parsedInput: Partial<History> = {};
    if (input.id) {
      parsedInput.id = input.id;
    }
    if (input.questionId) {
      parsedInput.questionId = input.questionId
        ? parseInt(input.questionId, 10)
        : undefined;
    }
    if (input.user1Id) {
      parsedInput.user1Id = input.user1Id;
    }
    if (input.user2Id) {
      parsedInput.user2Id = input.user2Id;
    }
    if (input.language) {
      parsedInput.language = input.language;
    }
    if (input.code) {
      parsedInput.code = input.code;
    }
    return parsedInput;
  }

  public parseFindAllInput(
    input: Partial<StringInterface<History>>
  ): Partial<History> {
    const parsedInput: Partial<History> = {};
    if (input.id) {
      parsedInput.id = input.id;
    }
    if (input.questionId) {
      parsedInput.questionId = input.questionId
        ? parseInt(input.questionId, 10)
        : undefined;
    }
    if (input.user1Id) {
      parsedInput.user1Id = input.user1Id;
    }
    if (input.user2Id) {
      parsedInput.user2Id = input.user2Id;
    }
    if (input.language) {
      parsedInput.language = input.language;
    }
    if (input.code) {
      parsedInput.code = input.code;
    }
    return parsedInput;
  }

  public parseUpdateInput(
    input: Partial<StringInterface<HistoryUpdateDTO>>
  ): Partial<HistoryUpdateDTO> {
    const parsedInput: Partial<HistoryUpdateDTO> = {};
    parsedInput.code = input.code;
    parsedInput.language = input.language;
    return parsedInput;
  }

  public parseDeleteInput(id: string): string {
    if (!id) throw new Error("Invalid Input");
    return id;
  }
}

export default HistoryParser;
