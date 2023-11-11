import { FullQuestion } from "../../../interfaces/fullQuestion/object";
import QuestionTopics from "../../topics/question";
import EventProducer from "../main.interface";

class FullQuestionProducer extends EventProducer<FullQuestion> {
  override create(object: FullQuestion): void {
    this.sendEvent(QuestionTopics.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override update(object: FullQuestion): void {
    this.sendEvent(QuestionTopics.UPDATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override delete(object: FullQuestion): void {
    this.sendEvent(QuestionTopics.DELETE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
}

export default FullQuestionProducer;
