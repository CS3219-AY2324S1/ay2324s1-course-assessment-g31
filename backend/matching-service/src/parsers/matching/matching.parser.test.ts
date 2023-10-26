import { describe } from "@jest/globals";

import { MatchingCreateDTO } from "../../interfaces/matching/createDTO";
import { StringInterface } from "../../util/stringInterface";
import MatchingParser from "./matching.parser";
import { Matching } from "../../interfaces/matching/object";
import { MatchingUpdateDTO } from "../../interfaces/matching/updateDTO";

describe("Test matching parser", () => {
  it("Parser - Parse Create Input: Valid Input -> Parsed Create Input", () => {
    const parser = new MatchingParser();

    const input: StringInterface<MatchingCreateDTO> = {
      user1Id: "123",
      user2Id: "456",
      requestId: "1",
    };

    const expectedOutput: MatchingCreateDTO = {
      user1Id: "123",
      user2Id: "456",
      requestId: 1,
    };

    expect(parser.parseCreateInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Create Input: Missing user1Id Input -> Throw Error", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<MatchingCreateDTO>> = {
      user2Id: "456",
      requestId: "1",
    };

    expect(() =>
      parser.parseCreateInput(input as StringInterface<MatchingCreateDTO>),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Create Input: Missing user2Id Input -> Throw Error", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<MatchingCreateDTO>> = {
      user1Id: "123",
      requestId: "1",
    };

    expect(() =>
      parser.parseCreateInput(input as StringInterface<MatchingCreateDTO>),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Create Input: Missing requestId Input -> Throw Error", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<MatchingCreateDTO>> = {
      user1Id: "123",
      user2Id: "456",
    };

    expect(() =>
      parser.parseCreateInput(input as StringInterface<MatchingCreateDTO>),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Find By Id Input: Valid Input -> Parsed Create Input", () => {
    const parser = new MatchingParser();

    const input: string = "1";

    const expectedOutput: number = 1;

    expect(parser.parseFindByIdInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find By Id Input: Invalid Input -> Parser Error", () => {
    const parser = new MatchingParser();

    const input = undefined;

    expect(() => parser.parseFindByIdInput(input)).toThrow("Invalid input");
  });

  it("Parser - Parse Find One Input: No Input -> Parser Error", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<Matching>> = {};

    expect(() => parser.parseFindOneInput(input)).toThrow("Invalid input");
  });

  it("Parser - Parse Find One Input: Valid Id Input -> Parsed Id Input", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<Matching>> = {
      id: "1",
    };

    const expectedOutput: Partial<Matching> = {
      id: 1,
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid user1Id Input -> Parsed Id Input", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<Matching>> = {
      user1Id: "1",
    };

    const expectedOutput: Partial<Matching> = {
      user1Id: "1",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid user2Id Input -> Parsed Id Input", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<Matching>> = {
      user2Id: "1",
    };

    const expectedOutput: Partial<Matching> = {
      user2Id: "1",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid requestId Input -> Parsed Id Input", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<Matching>> = {
      requestId: "1",
    };

    const expectedOutput: Partial<Matching> = {
      requestId: 1,
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid dateTimeMatched Input -> Parsed Id Input", () => {
    const parser = new MatchingParser();

    const FIXED_SYSTEM_TIME = "2020-11-18T00:00:00Z";

    const date = new Date(FIXED_SYSTEM_TIME);

    const input: Partial<StringInterface<Matching>> = {
      dateTimeMatched: date.toString(),
    };

    const expectedOutput: Partial<Matching> = {
      dateTimeMatched: date,
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Update Input: Valid Input -> Parsed Update Input", () => {
    const parser = new MatchingParser();

    const input: StringInterface<MatchingUpdateDTO> = {
      user1Id: "123",
      user2Id: "456",
      requestId: "1",
    };

    const expectedOutput: MatchingUpdateDTO = {
      user1Id: "123",
      user2Id: "456",
      requestId: 1,
    };

    expect(parser.parseUpdateInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Update Input: Missing user1Id Input -> Throw Error", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<MatchingUpdateDTO>> = {
      user2Id: "456",
      requestId: "1",
    };

    expect(() =>
      parser.parseUpdateInput(input as StringInterface<MatchingUpdateDTO>),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Update Input: Missing user2Id Input -> Throw Error", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<MatchingUpdateDTO>> = {
      user1Id: "123",
      requestId: "1",
    };

    expect(() =>
      parser.parseUpdateInput(input as StringInterface<MatchingUpdateDTO>),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Update Input: Missing requestId Input -> Throw Error", () => {
    const parser = new MatchingParser();

    const input: Partial<StringInterface<MatchingUpdateDTO>> = {
      user1Id: "123",
      user2Id: "456",
    };

    expect(() =>
      parser.parseUpdateInput(input as StringInterface<MatchingUpdateDTO>),
    ).toThrow("Invalid input");
  });

  it("Parser - Parse Delete Input: Valid Input -> Parsed Create Input", () => {
    const parser = new MatchingParser();

    const input: string = "1";

    const expectedOutput: number = 1;

    expect(parser.parseDeleteInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Delete Input: Invalid Input -> Parser Error", () => {
    const parser = new MatchingParser();

    const input = undefined;

    expect(() => parser.parseDeleteInput(input)).toThrow("Invalid input");
  });
});
