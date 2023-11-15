import QuestionService from "../../services/question/question.service";
import logger from "../../util/logger";
import prismaClient from "../../util/prisma/client";
import { ConsumerFunction } from "./main.interface";

const questionService = new QuestionService(prismaClient);

export const sessionEndConsumer: ConsumerFunction = async (message) => {
  if (message.value) {
    const { questionId } = JSON.parse(message.value.toString());

    console.log("Consuming Session Ended " + questionId);
    await questionService.incrementPopularity(questionId);
  }

  // Backpressure
  return Promise.resolve();
};
