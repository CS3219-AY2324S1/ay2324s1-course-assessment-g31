import { Matching } from "../../../interfaces/matching/object";
import MatchingTopics from "../../topics/matching/matching";
import EventProducer from "../main.abstract";

class MatchingProducer extends EventProducer<Matching> {
  override async create(object: Matching): Promise<void> {
    await this.sendEvent(MatchingTopics.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override async update(object: Matching): Promise<void> {
    await this.sendEvent(MatchingTopics.UPDATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override async delete(object: Matching): Promise<void> {
    await this.sendEvent(MatchingTopics.DELETE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
}

export default MatchingProducer;
