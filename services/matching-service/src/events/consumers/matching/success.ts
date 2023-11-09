import { Matching } from "../../../interfaces/matching/object";
import logger from "../../../util/logger";
import { ConsumerFunction } from "../main.interface";

const MatchingRequestSuccess: ConsumerFunction = (message) => {
  // Parse ICreatedMatchRequest from message
  if (message.value) {
    const matching: Matching = JSON.parse(message.value.toString());

    logger.info(
      `YOU HAVE A MATCH User: ${matching.user1Id}, IT IS USER: ${matching.user2Id}`,
    );
  }
};

export default MatchingRequestSuccess;
