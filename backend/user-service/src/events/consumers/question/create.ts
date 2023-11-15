import { ProducerConfig, Partitioners } from "kafkajs";
import Question from "../../../interfaces/question/object";
import UserService from "../../../services/user/user.service";
import logger from "../../../util/logger";
import prismaClient from "../../../util/prisma/client";
import kafka from "../../kafka";
import UserProducer from "../../producers/user/producer";
import { ConsumerFunction } from "../main.interface";

const producerConfig: ProducerConfig = {
  createPartitioner: Partitioners.LegacyPartitioner,
};

const userEventProducer = new UserProducer(kafka.producer(producerConfig));
const userService = new UserService(prismaClient);

const createQuestionConsumer: ConsumerFunction = async (message) => {
  logger.info("WE HAVE RECEIVED A MESSAGE FOR THE CREATION OF A QUESTION");

  if (!message.value) {
    return;
  }

  const inputQuestion: Question = JSON.parse(message.value.toString());

  const userFromDb = await userService.findById(inputQuestion.authorId);

  if (!userFromDb) {
    return;
  }

  const updatedUser = await userService.update(userFromDb.id, {
    ...userFromDb,
    questionsAuthored: userFromDb.questionsAuthored + 1,
  });

  userEventProducer.update(updatedUser);
};

export default createQuestionConsumer;
