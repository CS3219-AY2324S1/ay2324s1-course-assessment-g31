import QuestionService from "../../services/question/question.service";
import prismaClient from "../../util/prisma/client";
import { ConsumerFunction } from "./main.interface";

const questionService = new QuestionService(prismaClient);

export const sessionEndConsumer: ConsumerFunction = async (message) => {
  if (message.value) {
    const { questionId } = JSON.parse(message.value.toString());
    await questionService.incrementPopularity(questionId);
  }

  // Backpressure
  return Promise.resolve();
};
