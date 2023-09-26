import { MatchingCreateDTO } from "../../interfaces/matching/createDTO";
import { Matching } from "../../interfaces/matching/object";
import { MatchingUpdateDTO } from "../../interfaces/matching/updateDTO";
import { OptionalInterface } from "../../util/optionalInterface";
import { StringInterface } from "../../util/stringInterface";
import { Parser } from "../parser.interface";

class MatchingParser
  implements Parser<MatchingCreateDTO, MatchingUpdateDTO, Matching>
{
  constructor() {}

  public parseCreateInput(
    input: StringInterface<MatchingCreateDTO>
  ): MatchingCreateDTO {
    if (!input.user1Id || !input.user2Id || !input.requestId) {
      throw new Error("Invalid input");
    }
    return {
      user1Id: input.user1Id,
      user2Id: input.user2Id,
      requestId: parseInt(input.requestId),
    };
  }

  public parseFindByIdInput(id: string | undefined): number {
    if (!id) {
      throw new Error("Invalid input");
    }
    return parseInt(id);
  }

  public parseFindOneInput(
    input: OptionalInterface<StringInterface<Matching>>
  ): OptionalInterface<Matching> {
    const parsedInput: OptionalInterface<Matching> = {};
    if (input.id) {
      parsedInput.id = parseInt(input.id);
    }
    if (input.user1Id) {
      parsedInput.user1Id = input.user1Id;
    }
    if (input.user2Id) {
      parsedInput.user2Id = input.user2Id;
    }
    if (input.requestId) {
      parsedInput.requestId = parseInt(input.requestId);
    }
    if (input.dateTimeMatched) {
      parsedInput.dateTimeMatched = new Date(input.dateTimeMatched);
    }
    return parsedInput;
  }

  public parseUpdateInput(
    input: StringInterface<MatchingUpdateDTO>
  ): MatchingUpdateDTO {
    if (!input.user1Id || !input.user2Id || !input.requestId) {
      throw new Error("Invalid input");
    }
    return {
      user1Id: input.user1Id,
      user2Id: input.user2Id,
      requestId: parseInt(input.requestId),
    };
  }

  public parseDeleteInput(id: string | undefined): number {
    if (!id) {
      throw new Error("Invalid input");
    }
    return parseInt(id);
  }
}

export default MatchingParser;
