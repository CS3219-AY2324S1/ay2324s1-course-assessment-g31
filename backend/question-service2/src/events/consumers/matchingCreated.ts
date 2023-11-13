import { Matching } from "../../interfaces/matching/object";
import QuestionService from "../../services/question/question.service";
import prismaClient from "../../util/prisma/client";
import kafka from "../kafka";
import FullQuestionProducer from "../producers/question/producer";
import { ConsumerFunction } from "./main.interface";

const questionService = new QuestionService(prismaClient);
const fullQuestionEventProducer = new FullQuestionProducer(kafka.producer());

export const matchingCreatedConsumer: ConsumerFunction = async (message) => {
  if (message.value) {
    const matching: Matching = JSON.parse(message.value.toString());

    if (matching.questionIdRequested) {
      const questionFromDb = await questionService.findById(
        matching.questionIdRequested,
      );

      if (questionFromDb) {
        fullQuestionEventProducer.fulfil(matching);
      }
    } else {
      const selectedQuestion = await questionService.findOne({
        difficulty: matching.difficulty,
      });

      if (!selectedQuestion.data) {
        throw new Error(`No questions found at ${matching.difficulty}`);
      }
      fullQuestionEventProducer.fulfil({
        ...matching,
        questionIdRequested: selectedQuestion.data.id,
      });
    }

    // Backpressure
    return Promise.resolve();
  }
};
