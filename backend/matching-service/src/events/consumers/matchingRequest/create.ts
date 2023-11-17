import { MatchingRequest } from "@prisma/client";

import { Matching } from "../../../interfaces/matching/object";
import MatchingService from "../../../services/matching/matching.service";
import MatchingRequestService from "../../../services/matchingRequest/matchingRequest.service";
import prismaClient from "../../../util/prisma/client";
import MatchingProducer from "../../producers/matching/producer";
import MatchingRequestProducer from "../../producers/matchingRequest/producer";
import { ConsumerFunction } from "../main.interface";
import kafka from "../../kafka";
import logger from "../../../util/logger";
import { ProducerConfig, Partitioners } from "kafkajs";

const producerConfig: ProducerConfig = {
  createPartitioner: Partitioners.LegacyPartitioner,
};

export const matchingEventProducer = new MatchingProducer(
  kafka.producer(producerConfig),
);
export const matchingRequestEventProducer = new MatchingRequestProducer(
  kafka.producer(producerConfig),
);
const matchingService = new MatchingService(prismaClient);
const matchingRequestService = new MatchingRequestService(prismaClient);

const createMatchingRequestConsumer: ConsumerFunction = async (message) => {
  logger.info(
    "WE HAVE RECEIVED A MESSAGE FOR THE CREATION OF A MATCHING REQUEST",
  );
  if (message.value) {
    // Parse the json message
    const inputMatchingReq: MatchingRequest = JSON.parse(
      message.value.toString(),
    );

    const matchReqFromDB: MatchingRequest | null =
      await matchingRequestService.findOne(inputMatchingReq);

    if (!matchReqFromDB || matchReqFromDB.success) {
      return;
    }

    const counterPartyMatchReq: MatchingRequest | null =
      await matchingService.findMatch(matchReqFromDB);

    if (!counterPartyMatchReq) {
      matchingRequestEventProducer.fail(matchReqFromDB);
      return;
    }

    const matching: Matching = await matchingService.create({
      user1Id: counterPartyMatchReq.userId,
      user2Id: matchReqFromDB.userId,
      requestId: matchReqFromDB.id,
      difficulty: matchReqFromDB.difficulty,
      questionIdRequested: matchReqFromDB.questionId,
    });

    if (matching) {
      // Update matching request
      await matchingRequestService.update(counterPartyMatchReq.id, {
        ...counterPartyMatchReq,
        success: true,
      });

      await matchingRequestService.update(matchReqFromDB.id, {
        ...matchReqFromDB,
        success: true,
      });

      const matchingReqs = await matchingRequestService.findAll();
      console.log(
        "Match Created. NUMBER OF EASY MATCHING REQUEST: ",
        matchingReqs.filter(
          (x) => x.difficulty.toLowerCase() === "easy" && !x.success,
        ).length,
      );
      console.log(
        "Match Created. NUMBER OF MEDIUM MATCHING REQUEST: ",
        matchingReqs.filter(
          (x) => x.difficulty.toLowerCase() === "medium" && !x.success,
        ).length,
      );
      console.log(
        "Match Created. NUMBER OF HARD MATCHING REQUEST: ",
        matchingReqs.filter(
          (x) => x.difficulty.toLowerCase() === "hard" && !x.success,
        ).length,
      );
      matchingEventProducer.create(matching);
    }
  }
};

export default createMatchingRequestConsumer;
