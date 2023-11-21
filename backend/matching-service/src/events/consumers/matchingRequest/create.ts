import { MatchingRequest } from '@prisma/client';
import { Partitioners } from 'kafkajs';

import MatchingService from '../../../services/matching/matching.service';
import MatchingRequestService from '../../../services/matchingRequest/matchingRequest.service';
import logger from '../../../util/logger';
import prismaClient from '../../../util/prisma/client';
import kafka from '../../kafka';
import MatchingProducer from '../../producers/matching/producer';
import MatchingRequestProducer from '../../producers/matchingRequest/producer';
import { ConsumerFunction } from '../main.interface';

const matchingEventProducer = new MatchingProducer(
  kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
);
const matchingRequestEventProducer = new MatchingRequestProducer(
  kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
);
const matchingService = new MatchingService(prismaClient);
const matchingRequestService = new MatchingRequestService(prismaClient);

const createMatchingRequestConsumer: ConsumerFunction = async (message) => {
  logger.info(
    "WE HAVE RECEIVED A MESSAGE FOR THE CREATION OF A MATCHING REQUEST"
  );
  if (message.value) {
    // Parse the json message
    const inputMatchingReq: MatchingRequest = JSON.parse(
      message.value.toString()
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

    let matching;

    await prismaClient.$transaction(async (prisma) => {
      // Step 1: Begin a transaction
      await prisma.$executeRaw`BEGIN`;

      try {
        // Step 2: Lock the row for client 1
        await prisma.$executeRaw`SELECT * FROM "MatchingRequest" WHERE id = ${counterPartyMatchReq.id} FOR UPDATE`;
        await prisma.$executeRaw`SELECT * FROM "MatchingRequest" WHERE id = ${matchReqFromDB.id} FOR UPDATE`;

        // Step 3: Update the value for client 1
        await prisma.matchingRequest.update({
          where: { id: counterPartyMatchReq.id },
          data: { success: true },
        });

        await prisma.matchingRequest.update({
          where: { id: matchReqFromDB.id },
          data: { success: true },
        });

        matching = await prisma.matching.create({
          data: {
            user1Id: counterPartyMatchReq.userId,
            user2Id: matchReqFromDB.userId,
            requestId: matchReqFromDB.id,
            difficulty: matchReqFromDB.difficulty,
            questionIdRequested: matchReqFromDB.questionId,
          },
        });

        // Step 4: Commit the transaction
        await prisma.$executeRaw`COMMIT`;
      } catch (error) {
        // Step 5: Rollback the transaction if an error occurs
        await prisma.$executeRaw`ROLLBACK`;
        console.log(error);
      }
    });

    if (matching) {
      matchingEventProducer.create(matching);
    }
  }

  return Promise.resolve();
};

export default createMatchingRequestConsumer;
