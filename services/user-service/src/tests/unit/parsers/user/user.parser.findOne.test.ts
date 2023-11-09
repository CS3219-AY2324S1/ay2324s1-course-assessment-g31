import { describe } from "@jest/globals";

import { User } from "../../../../interfaces/user/object";
import { StringInterface } from "../../../../util/stringInterface";
import UserParser from "../../../../parsers/user/user.parser";

describe("Test User Parser Parse Find One Input", () => {
  it("Parser - Parse Find One Input: No Input -> Parser Error", () => {
    const parser = new UserParser();

    const input: Partial<StringInterface<User>> = {};

    expect(() => parser.parseFindOneInput(input)).toThrow("Invalid Input");
  });

  it("Parser - Parse Find One Input: Valid Id Input -> Parsed Id Input", () => {
    const parser = new UserParser();

    const input: Partial<StringInterface<User>> = {
      id: "1",
    };

    const expectedOutput: Partial<User> = {
      id: "1",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid name Input -> Parsed name Input", () => {
    const parser = new UserParser();

    const input: Partial<StringInterface<User>> = {
      name: "name",
    };

    const expectedOutput: Partial<User> = {
      name: "name",
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });

  it("Parser - Parse Find One Input: Valid roles Input -> Parsed roles Input", () => {
    const parser = new UserParser();

    const input: Partial<StringInterface<User>> = {
      roles: ["user"],
    };

    const expectedOutput: Partial<User> = {
      roles: ["user"],
    };

    expect(parser.parseFindOneInput(input)).toEqual(expectedOutput);
  });
});
