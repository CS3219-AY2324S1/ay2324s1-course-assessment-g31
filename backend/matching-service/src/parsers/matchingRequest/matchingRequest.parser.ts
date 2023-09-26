import { MatchingRequestCreateDTO } from "../../interfaces/matchingRequest/createDTO";
import { MatchingRequest } from "../../interfaces/matchingRequest/object";
import { MatchingRequestUpdateDTO } from "../../interfaces/matchingRequest/updateDTO";
import { OptionalInterface } from "../../util/optionalInterface";
import { StringInterface } from "../../util/stringInterface";
import { Parser } from "../parser.interface";

class MatchingRequestParser
  implements
    Parser<MatchingRequestCreateDTO, MatchingRequestUpdateDTO, MatchingRequest>
{
  constructor() {}

  public parseCreateInput(
    input: StringInterface<MatchingRequestCreateDTO>
  ): MatchingRequestCreateDTO {
    if (!input.userId || !input.difficulty) {
      throw new Error("Invalid input");
    }
    if (input.questionId) {
      return {
        userId: input.userId,
        questionId: parseInt(input.questionId),
        difficulty: input.difficulty,
      };
    }
    return {
      userId: input.userId,
      difficulty: input.difficulty,
    };
  }

  public parseFindByIdInput(id: string | undefined): number {
    if (!id) {
      throw new Error("Invalid input");
    }
    return parseInt(id);
  }

  public parseFindOneInput(
    input: OptionalInterface<StringInterface<MatchingRequest>>
  ): OptionalInterface<MatchingRequest> {
    if (!input) {
      throw new Error("Invalid input");
    }
    const result: OptionalInterface<MatchingRequest> = {};
    if (input.id) {
      result.id = parseInt(input.id);
    }
    if (input.userId) {
      result.userId = input.userId;
    }
    if (input.questionId) {
      result.questionId = parseInt(input.questionId);
    }
    if (input.difficulty) {
      result.difficulty = input.difficulty;
    }
    return result;
  }

  public parseUpdateInput(
    input: StringInterface<MatchingRequestUpdateDTO>
  ): MatchingRequestUpdateDTO {
    if (!input.userId || !input.difficulty) {
      throw new Error("Invalid input");
    }
    if (input.questionId) {
      return {
        userId: input.userId,
        questionId: parseInt(input.questionId),
        difficulty: input.difficulty,
        success: input.success == "true",
      };
    }
    return {
      userId: input.userId,
      questionId: null,
      difficulty: input.difficulty,
      success: input.success == "true",
    };
  }

  public parseDeleteInput(id: string | undefined): number {
    if (!id) {
      throw new Error("Invalid input");
    }

    return parseInt(id);
  }
}

export default MatchingRequestParser;
