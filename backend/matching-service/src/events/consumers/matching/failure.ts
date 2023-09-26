import { MatchingRequest } from "../../../interfaces/matchingRequest/object";
import { ConsumerFunction } from "../main.interface";

const MatchingRequestFailure: ConsumerFunction = (message) => {
  // Parse ICreatedMatchRequest from message
  if (message.value) {
    const matchingRequest: MatchingRequest = JSON.parse(
      message.value.toString()
    );

    console.log(`YOU HAVE NO FRIENDS User: ${matchingRequest.userId}`);
  }
};

export default MatchingRequestFailure;
