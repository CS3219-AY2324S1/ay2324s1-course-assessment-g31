import { describe } from "@jest/globals";

import { UserUpdateDTO } from "../../../../interfaces/user/updateDTO";
import { StringInterface } from "../../../../util/stringInterface";
import UserParser from "../../../../parsers/user/user.parser";

const allFieldsInput: StringInterface<UserUpdateDTO> = {
  username: "abc123",
  roles: ["admin"],
  questionsAuthored: "3",
};

describe("Test User Parser Parse Update Input", () => {
  it("Parser - Parse Update Input: Valid Input -> Parsed Update Input", () => {
    const parser = new UserParser();

    const expectedOutput: UserUpdateDTO = {
      ...allFieldsInput,
      questionsAuthored: parseInt(allFieldsInput.questionsAuthored),
    };

    expect(parser.parseUpdateInput(allFieldsInput)).toEqual(expectedOutput);
  });
});
