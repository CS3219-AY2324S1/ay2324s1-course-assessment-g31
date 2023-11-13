import { UserCreateDTO } from "../../interfaces/userService/createDTO";
import { User } from "../../interfaces/userService/object";
import { UserUpdateDTO } from "../../interfaces/userService/updateDTO";
import GenericController from "../generic.controller";

class UserController extends GenericController {
  constructor() {
    super(
      window.location.hostname !== "localhost"
        ? "https://user-service-qzxsy455sq-as.a.run.app"
        : "http://localhost:5001",
      "api",
    );
  }

  createUser(data: UserCreateDTO) {
    return this.post<User, UserCreateDTO>("users", data);
  }

  getUser(id: string) {
    return this.get<User>(`users/${id}`);
  }

  updateUser(id: string, data: Partial<UserUpdateDTO>) {
    return this.put<User, Partial<UserUpdateDTO>>(`users/${id}`, data);
  }

  deleteUser(id: string) {
    return this.delete<User>(`users/${id}`);
  }
}

export default UserController;
