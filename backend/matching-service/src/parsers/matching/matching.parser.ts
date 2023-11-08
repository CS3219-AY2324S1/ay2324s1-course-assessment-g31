import { MatchingCreateDTO } from "../../interfaces/matching/createDTO";
import { Matching } from "../../interfaces/matching/object";
import { MatchingUpdateDTO } from "../../interfaces/matching/updateDTO";


import { StringInterface } from "../../util/stringInterface";
import Parser from "../parser.interface";

class MatchingParser
  implements Parser<MatchingCreateDTO, MatchingUpdateDTO, Matching>
{
  public parseCreateInput(
    input: StringInterface<MatchingCreateDTO>,
  ): MatchingCreateDTO {
    if (!input.user1Id || !input.user2Id || !input.requestId) {
      throw new Error("Invalid Input");
    }
    return {
      user1Id: input.user1Id,
      user2Id: input.user2Id,
      requestId: parseInt(input.requestId, 10),
    };
  }

  public parseFindByIdInput(id: string | undefined): number {
    if (!id) {
      throw new Error("Invalid Input");
    }
    return parseInt(id, 10);
  }

  public parseFindOneInput(
    input: Partial<StringInterface<Matching>>,
  ): Partial<Matching> {
    if (!input || Object.keys(input).length == 0) {
      throw new Error("Invalid Input");
    }
    const parsedInput: Partial<Matching> = {};
    if (input.id) {
      parsedInput.id = parseInt(input.id, 10);
    }
    if (input.user1Id) {
      parsedInput.user1Id = input.user1Id;
    }
    if (input.user2Id) {
      parsedInput.user2Id = input.user2Id;
    }
    if (input.requestId) {
      parsedInput.requestId = parseInt(input.requestId, 10);
    }
    if (input.dateTimeMatched) {
      parsedInput.dateTimeMatched = new Date(input.dateTimeMatched);
    }
    return parsedInput;
  }

  public parseUpdateInput(
    input: StringInterface<MatchingUpdateDTO>,
  ): MatchingUpdateDTO {
    if (!input.user1Id || !input.user2Id || !input.requestId) {
      throw new Error("Invalid Input");
    }
    return {
      user1Id: input.user1Id,
      user2Id: input.user2Id,
      requestId: parseInt(input.requestId, 10),
    };
  }

  public parseDeleteInput(id: string | undefined): number {
    if (!id) {
      throw new Error("Invalid Input");
    }
    return parseInt(id, 10);
  }
}

export default MatchingParser;
