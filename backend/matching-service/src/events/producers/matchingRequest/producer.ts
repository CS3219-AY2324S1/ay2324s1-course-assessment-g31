import { MatchingRequest } from "../../../interfaces/matchingRequest/object";
import MatchingRequestTopics from "../../topics/matchingRequest/topic";
import EventProducer from "../main.interface";

class MatchingRequestProducer extends EventProducer<MatchingRequest> {
  override create = (object: MatchingRequest): void => {
    this.sendEvent(MatchingRequestTopics.CREATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  };

  override update = (object: MatchingRequest): void => {
    this.sendEvent(MatchingRequestTopics.UPDATE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  };

  override delete = (object: MatchingRequest): void => {
    this.sendEvent(MatchingRequestTopics.DELETE, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  };

  fail = (object: MatchingRequest): void => {
    this.sendEvent(MatchingRequestTopics.FAIL, [
      {
        key: object.id.toString(),
        value: JSON.stringify(object),
      },
    ]);
  };
}

export default MatchingRequestProducer;
