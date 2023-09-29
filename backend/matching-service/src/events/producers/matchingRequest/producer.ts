import { MatchingRequest } from "../../../interfaces/matchingRequest/object";
import { MATCHING_REQUEST_TOPICS } from "../../topics/matchingRequest/topic";
import { EventProducer } from "../main.interface";

class MatchingRequestProducer extends EventProducer<MatchingRequest> {
  override create = (object: MatchingRequest): void => {
    this.sendEvent(MATCHING_REQUEST_TOPICS.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  };

  override update = (object: MatchingRequest): void => {
    this.sendEvent(MATCHING_REQUEST_TOPICS.UPDATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  };

  override delete = (object: MatchingRequest): void => {
    this.sendEvent(MATCHING_REQUEST_TOPICS.DELETE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  };

  fail = (object: MatchingRequest): void => {
    this.sendEvent(MATCHING_REQUEST_TOPICS.FAIL, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  }
}

export default MatchingRequestProducer;
