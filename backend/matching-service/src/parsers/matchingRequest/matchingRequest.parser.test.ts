import { describe } from "@jest/globals";

import { StringInterface } from "../../util/stringInterface";
import MatchingRequestParser from "./matchingRequest.parser";
import { MatchingRequestCreateDTO } from "../../interfaces/matchingRequest/createDTO";
import { MatchingRequestUpdateDTO } from "../../interfaces/matchingRequest/updateDTO";
import { MatchingRequest } from "../../interfaces/matchingRequest/object";

describe("Test Matching Request parser", () => {
  it("Parser - Parse Create Input: Valid Input -> Parsed Create Input", () => {
    const parser = new MatchingRequestParser();

    const input: StringInterface<MatchingRequestCreateDTO> = {
      userId: "abc",
      questionId: "1",
      difficulty: "easy",
    };

    const expectedOutput: MatchingRequestCreateDTO = {
      userId: "abc",
      questionId: 1,
      difficulty: "easy",
    };

    expect(parser.parseCreateInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Create Input: Valid Input (No Optional) -> Parsed Create Input", () => {
    const parser = new MatchingRequestParser();

    const input: StringInterface<MatchingRequestCreateDTO> = {
      userId: "abc",
      difficulty: "easy",
    };

    const expectedOutput: MatchingRequestCreateDTO = {
      userId: "abc",
      difficulty: "easy",
    };

    expect(parser.parseCreateInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Create Input: Missing userId Input -> Throw Error", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequestCreateDTO>> = {
      difficulty: "456",
      questionId: "1",
    };

    expect(() =>
      parser.parseCreateInput(
        input as StringInterface<MatchingRequestCreateDTO>,
      ),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Create Input: Missing difficulty Input -> Throw Error", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequestCreateDTO>> = {
      userId: "123",
      questionId: "1",
    };

    expect(() =>
      parser.parseCreateInput(
        input as StringInterface<MatchingRequestCreateDTO>,
      ),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Find By Id Input: Valid Input -> Parsed Create Input", () => {
    const parser = new MatchingRequestParser();

    const input: string = "1";

    const expectedOutput: number = 1;

    expect(parser.parseFindByIdInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find By Id Input: Invalid Input -> Parser Error", () => {
    const parser = new MatchingRequestParser();

    const input = undefined;

    expect(() => parser.parseFindByIdInput(input)).toThrow("Invalid input");
  });

  it("Parser - Parse Find One Input: No Input -> Parser Error", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequest>> = {};

    expect(() => parser.parseFindOneInput(input)).toThrow("Invalid input");
  });

  it("Parser - Parse Find One Input: Valid Id Input -> Parsed Id Input", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequest>> = {
      id: "1",
    };

    const expectedOutput: Partial<MatchingRequest> = {
      id: 1,
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid userId Input -> Parsed Id Input", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequest>> = {
      userId: "1",
    };

    const expectedOutput: Partial<MatchingRequest> = {
      userId: "1",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid difficulty Input -> Parsed Id Input", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequest>> = {
      difficulty: "1",
    };

    const expectedOutput: Partial<MatchingRequest> = {
      difficulty: "1",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid questionId Input -> Parsed Id Input", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequest>> = {
      questionId: "1",
    };

    const expectedOutput: Partial<MatchingRequest> = {
      questionId: 1,
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid dateRequested Input -> Parsed Id Input", () => {
    const parser = new MatchingRequestParser();

    const FIXED_SYSTEM_TIME = "2020-11-18T00:00:00Z";

    const date = new Date(FIXED_SYSTEM_TIME);

    const input: Partial<StringInterface<MatchingRequest>> = {
      dateRequested: date.toString(),
    };

    const expectedOutput: Partial<MatchingRequest> = {
      dateRequested: date,
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Update Input: Valid Input -> Parsed Update Input", () => {
    const parser = new MatchingRequestParser();

    const input: StringInterface<MatchingRequestUpdateDTO> = {
      userId: "123",
      difficulty: "456",
      questionId: "1",
      success: "true",
    };

    const expectedOutput: MatchingRequestUpdateDTO = {
      userId: "123",
      difficulty: "456",
      questionId: 1,
      success: true,
    };

    expect(parser.parseUpdateInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Update Input: Valid Input (no questionId) -> Parsed Update Input", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequestUpdateDTO>> = {
      userId: "123",
      difficulty: "easy",
      success: "false",
    };

    const expectedOutput: MatchingRequestUpdateDTO = {
      userId: input.userId!,
      questionId: null,
      difficulty: input.difficulty!,
      success: false,
    };

    expect(
      parser.parseUpdateInput(
        input as StringInterface<MatchingRequestUpdateDTO>,
      ),
    ).toEqual(expectedOutput);
  });

  it("Parser - Parse Update Input: Missing userId Input -> Throw Error", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequestUpdateDTO>> = {
      difficulty: "456",
      questionId: "1",
    };

    expect(() =>
      parser.parseUpdateInput(
        input as StringInterface<MatchingRequestUpdateDTO>,
      ),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Update Input: Missing difficulty Input -> Throw Error", () => {
    const parser = new MatchingRequestParser();

    const input: Partial<StringInterface<MatchingRequestUpdateDTO>> = {
      userId: "123",
      questionId: "1",
    };

    expect(() =>
      parser.parseUpdateInput(
        input as StringInterface<MatchingRequestUpdateDTO>,
      ),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Delete Input: Valid Input -> Parsed Create Input", () => {
    const parser = new MatchingRequestParser();

    const input: string = "1";

    const expectedOutput: number = 1;

    expect(parser.parseDeleteInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Delete Input: Invalid Input -> Parser Error", () => {
    const parser = new MatchingRequestParser();

    const input = undefined;

    expect(() => parser.parseDeleteInput(input)).toThrow("Invalid input");
  });
});
