import { Matching } from "../../../interfaces/matching/object";
import MatchingTopics from "../../topics/matching/matching";
import EventProducer from "../main.abstract";

class MatchingProducer extends EventProducer<Matching> {
  override create(object: Matching): void {
    this.sendEvent(MatchingTopics.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override update(object: Matching): void {
    this.sendEvent(MatchingTopics.UPDATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override delete(object: Matching): void {
    this.sendEvent(MatchingTopics.DELETE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
}

export default MatchingProducer;
