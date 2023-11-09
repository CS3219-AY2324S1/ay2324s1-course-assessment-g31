import prisma from "../../model/prismaClient";
import { getRandomInt } from "../../util/util";
import produceEvent, { ProducerTopics } from "../producer/producer";
import { ConsumerFunction } from "./main.interface";

export const matchingCreatedConsumer: ConsumerFunction = async (message) => {
  if (message.value) {
    const { difficulty, questionId, user1Id, user2Id, requestId } = JSON.parse(
      message.value.toString()
    );

    if (questionId) {
      // check if questionId exists
      const questionExists = await prisma.question.findUnique({
        select: { id: true },
        where: { id: questionId },
      });

      if (questionExists) {
        produceEvent(ProducerTopics.MATCHING_FULFILLED, [
          {
            key: requestId,
            value: JSON.stringify({
              requestId,
              user1Id,
              user2Id,
              questionId,
            }),
          },
        ]);
      }
    } else {
      // get random questionId of difficulty
      const questionIds = await prisma.question.findMany({
        select: { id: true },
        where: { difficulty: difficulty },
      });

      if (questionIds.length === 0) {
        throw new Error(`No questions found at ${difficulty}`);
      }
      const idToGet = questionIds.at(getRandomInt(0, questionIds.length))?.id;
      produceEvent(ProducerTopics.MATCHING_FULFILLED, [
        {
          key: requestId,
          value: JSON.stringify({
            requestId,
            user1Id,
            user2Id,
            questionId: idToGet,
          }),
        },
      ]);
    }
  }
};
