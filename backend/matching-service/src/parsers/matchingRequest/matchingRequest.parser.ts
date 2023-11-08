import { MatchingRequestCreateDTO } from "../../interfaces/matchingRequest/createDTO";
import { MatchingRequest } from "../../interfaces/matchingRequest/object";
import { MatchingRequestUpdateDTO } from "../../interfaces/matchingRequest/updateDTO";


import { StringInterface } from "../../util/stringInterface";
import Parser from "../parser.interface";

class MatchingRequestParser
  implements
    Parser<MatchingRequestCreateDTO, MatchingRequestUpdateDTO, MatchingRequest>
{
  public parseCreateInput(
    input: StringInterface<MatchingRequestCreateDTO>,
  ): MatchingRequestCreateDTO {
    if (!input.userId || !input.difficulty) {
      throw new Error("Invalid Input");
    }
    if (input.questionId) {
      return {
        userId: input.userId,
        questionId: parseInt(input.questionId, 10),
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
      throw new Error("Invalid Input");
    }
    return parseInt(id, 10);
  }

  public parseFindOneInput(
    input: Partial<StringInterface<MatchingRequest>>,
  ): Partial<MatchingRequest> {
    if (!input || Object.keys(input).length == 0) {
      throw new Error("Invalid Input");
    }
    const result: Partial<MatchingRequest> = {};
    if (input.id) {
      result.id = parseInt(input.id, 10);
    }
    if (input.userId) {
      result.userId = input.userId;
    }
    if (input.questionId) {
      result.questionId = parseInt(input.questionId, 10);
    }
    if (input.difficulty) {
      result.difficulty = input.difficulty;
    }
    if (input.dateRequested) {
      result.dateRequested = new Date(input.dateRequested);
    }
    if (input.dateRequested) {
      result.dateRequested = new Date(input.dateRequested);
    }
    return result;
  }

  public parseUpdateInput(
    input: StringInterface<MatchingRequestUpdateDTO>,
  ): MatchingRequestUpdateDTO {
    if (!input.userId || !input.difficulty) {
      throw new Error("Invalid Input");
    }
    if (input.questionId) {
      return {
        userId: input.userId,
        questionId: parseInt(input.questionId, 10),
        difficulty: input.difficulty,
        success: input.success === "true",
      };
    }
    return {
      userId: input.userId,
      questionId: null,
      difficulty: input.difficulty,
      success: input.success === "true",
    };
  }

  public parseDeleteInput(id: string | undefined): number {
    if (!id) {
      throw new Error("Invalid Input");
    }

    return parseInt(id, 10);
  }
}

export default MatchingRequestParser;
