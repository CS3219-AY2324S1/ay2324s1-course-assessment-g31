import { User } from "../../../interfaces/user/object";
import UserTopics from "../../topics/user";
import EventProducer from "../main.interface";

class UserProducer extends EventProducer<User> {
  override create(object: User): void {
    this.sendEvent(UserTopics.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override update(object: User): void {
    this.sendEvent(UserTopics.UPDATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override delete(object: User): void {
    this.sendEvent(UserTopics.DELETE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
}

export default UserProducer;
