import { UserCreateDTO } from "../../interfaces/user/createDTO";
import { User } from "../../interfaces/user/object";
import { UserUpdateDTO } from "../../interfaces/user/updateDTO";

import { StringInterface } from "../../util/stringInterface";
import Parser from "../parser.interface";

class UserParser implements Parser<UserCreateDTO, UserUpdateDTO, User> {
  public parseCreateInput(
    input: StringInterface<UserCreateDTO>,
  ): UserCreateDTO {
    if (!input.id || !input.username || !input.roles) {
      throw new Error("Invalid Input");
    }
    return {
      id: input.id,
      username: input.username,
      roles: input.roles,
    };
  }

  public parseFindByIdInput(id: string): string {
    if (!id) throw new Error("Invalid Input");
    return id;
  }

  public parseFindOneInput(
    input: Partial<StringInterface<User>>,
  ): Partial<User> {
    if (!input || Object.keys(input).length == 0)
      throw new Error("Invalid Input");
    const parsedInput: Partial<User> = {};
    if (input.id) {
      parsedInput.id = input.id;
    }
    if (input.username) {
      parsedInput.username = input.username;
    }
    if (input.roles) {
      parsedInput.roles = input.roles;
    }
    if (input.questionsAuthored) {
      parsedInput.questionsAuthored = parseInt(input.questionsAuthored, 10);
    }
    return parsedInput;
  }

  public parseUpdateInput(
    input: Partial<StringInterface<UserUpdateDTO>>,
  ): Partial<UserUpdateDTO> {
    const parsedInput: Partial<UserUpdateDTO> = {};
    if (input.username) {
      parsedInput.username = input.username;
    }

    if (input.roles) {
      parsedInput.roles = input.roles;
    }

    if (input.questionsAuthored) {
      parsedInput.questionsAuthored = parseInt(input.questionsAuthored, 10);
    }

    return parsedInput;
  }

  public parseDeleteInput(id: string): string {
    if (!id) throw new Error("Invalid Input");
    return id;
  }
}

export default UserParser;
