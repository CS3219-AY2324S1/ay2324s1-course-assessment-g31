import { Partitioners } from "kafkajs";
import { Matching } from "../../interfaces/matching/object";
import QuestionService from "../../services/question/question.service";
import logger from "../../util/logger";
import prismaClient from "../../util/prisma/client";
import kafka from "../kafka";
import FullQuestionProducer from "../producers/question/producer";
import { ConsumerFunction } from "./main.interface";

const questionService = new QuestionService(prismaClient);
const fullQuestionEventProducer = new FullQuestionProducer(
  kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner }),
);

export const matchingCreatedConsumer: ConsumerFunction = async (message) => {
  console.log("Consuming Matching Created " + message);
  if (message.value) {
    console.log("Starting consuming");
    const matching: Matching = JSON.parse(message.value.toString());
    console.log("Consuming Matching Created " + matching.id);

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
        logger.info(`No questions found at ${matching.difficulty}`);
      } else {
        fullQuestionEventProducer.fulfil({
            ...matching,
            questionIdRequested: selectedQuestion.data.id,
          });
      }
    }

    // Backpressure
    return Promise.resolve();
  }
};
