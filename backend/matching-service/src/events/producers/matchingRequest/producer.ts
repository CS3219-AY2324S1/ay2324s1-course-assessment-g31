import { MatchingRequest } from "../../../interfaces/matchingRequest/object";
import MatchingRequestTopics from "../../topics/matchingRequest/topic";
import EventProducer from "../main.abstract";

class MatchingRequestProducer extends EventProducer<MatchingRequest> {
  override async create(object: MatchingRequest): Promise<void> {
    await this.sendEvent(MatchingRequestTopics.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override async update(object: MatchingRequest): Promise<void> {
    await this.sendEvent(MatchingRequestTopics.UPDATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  override async delete(object: MatchingRequest): Promise<void> {
    await this.sendEvent(MatchingRequestTopics.DELETE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }

  async fail(object: MatchingRequest): Promise<void> {
    await this.sendEvent(MatchingRequestTopics.FAIL, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
}

export default MatchingRequestProducer;
