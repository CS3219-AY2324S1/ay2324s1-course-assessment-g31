import { ConsumerFunction } from "./main.interface";
import HistoryService from "../../services/history/history.service";
import prismaClient from "../../util/prisma/client";
import HistoryParser from "../../parsers/history/history.parser";

const historyService = new HistoryService(prismaClient);
const historyParser = new HistoryParser();

export const sessionEndConsumer: ConsumerFunction = (message) => {
  if (message.value) {
    const sessionDetails = JSON.parse(message.value.toString());

    const parsedInput = historyParser.parseCreateInput(sessionDetails);
    historyService
      .create(parsedInput)
      .then(() => console.log("history created"));
  }
};
