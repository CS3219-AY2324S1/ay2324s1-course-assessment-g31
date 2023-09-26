import { Matching } from "../../../interfaces/matching/object";
import { MATCHING_TOPICS } from "../../topics/matching/matching";
import { EventProducer } from "../main.interface";

class MatchingProducer extends EventProducer<Matching> {
  override create(object: Matching): void {
    this.sendEvent(MATCHING_TOPICS.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
  override update(object: Matching): void {
    this.sendEvent(MATCHING_TOPICS.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
  override delete(object: Matching): void {
    this.sendEvent(MATCHING_TOPICS.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
}

export default MatchingProducer;
