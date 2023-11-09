import { MatchingRequest } from "../../../interfaces/matchingRequest/object";
import logger from "../../../util/logger";
import { ConsumerFunction } from "../main.interface";

const MatchingRequestFailure: ConsumerFunction = (message) => {
  // Parse ICreatedMatchRequest from message
  if (message.value) {
    const matchingRequest: MatchingRequest = JSON.parse(
      message.value.toString(),
    );

    logger.info(
      `THERE IS CURRENTLY NO COUNTERPART FOR YOU: ${matchingRequest.userId}`,
    );
  }
};

export default MatchingRequestFailure;
