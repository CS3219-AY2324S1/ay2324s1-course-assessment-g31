import { SessionDetails, QuestionAttemptEntry } from "../../types/types";
import prisma from "../../model/prismaClient";
import { ConsumerFunction } from "./main.interface";

export const sessionEndConsumer: ConsumerFunction = (message) => {
  if (message.value) {
    const sessionDetails: SessionDetails = JSON.parse(message.value.toString());

    const questionAttempt: QuestionAttemptEntry = {
      ...sessionDetails,
      attemptDateTime: new Date(),
    };

    // add to db
    prisma.questionAttempt.create({
      data: questionAttempt,
    });
  }
};
