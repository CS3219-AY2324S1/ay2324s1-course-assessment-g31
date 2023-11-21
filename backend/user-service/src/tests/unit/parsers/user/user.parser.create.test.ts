import { describe } from "@jest/globals";

import { UserCreateDTO } from "../../../../interfaces/user/createDTO";
import { StringInterface } from "../../../../util/stringInterface";
import UserParser from "../../../../parsers/user/user.parser";

const allFieldsInput: StringInterface<UserCreateDTO> = {
  id: "abc123",
  username: "abc",
  roles: ["user"],
};

describe("Test User Parser Parse Create Input", () => {
  it("Parser - Parse Create Input: Valid Input -> Parsed Create Input", () => {
    const parser = new UserParser();

    const expectedOutput: UserCreateDTO = {
      ...allFieldsInput,
    };

    expect(parser.parseCreateInput(allFieldsInput)).toEqual(expectedOutput);
  });

  it("Parser - Parse Create Input: Missing id Input -> Throw Error", () => {
    const parser = new UserParser();

    const { id, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<UserCreateDTO>,
      ),
    ).toThrow("Invalid Input");
  });

  it("Parser - Parse Create Input: Missing username Input -> Throw Error", () => {
    const parser = new UserParser();

    const { username, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<UserCreateDTO>,
      ),
    ).toThrow("Invalid Input");
  });

  it("Parser - Parse Create Input: Missing roles Input -> Throw Error", () => {
    const parser = new UserParser();

    const { roles, ...rest } = allFieldsInput;

    expect(() =>
      parser.parseCreateInput(
        rest as unknown as StringInterface<UserCreateDTO>,
      ),
    ).toThrow("Invalid Input");
  });
});
