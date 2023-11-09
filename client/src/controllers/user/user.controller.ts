import { User, UserCreateDTO, UserUpdateDTO } from "../../interfaces/User";
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
    return this.post<User, UserCreateDTO>("user", data);
  }

  getUser(id: string) {
    return this.get<User>(`user/${id}`);
  }

  updateUser(id: string, data: Partial<UserUpdateDTO>) {
    return this.put<User, Partial<UserUpdateDTO>>(`user/${id}`, data);
  }

  deleteUser(id: string) {
    return this.delete<User>("user");
  }
}

export default UserController;
