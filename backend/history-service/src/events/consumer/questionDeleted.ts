import HistoryService from "../../services/history/history.service";
import prismaClient from "../../util/prisma/client";
import { ConsumerFunction } from "./main.interface";

const historyService = new HistoryService(prismaClient);

export const questionDeletedConsumer: ConsumerFunction = async (message) => {
  if (message.value) {
    const { questionId } = JSON.parse(message.value.toString());

    console.log("Consuming Question Deleted " + questionId);
    await historyService.deleteByQnId(questionId);
    // Backpressure
    return Promise.resolve();
  }
};
