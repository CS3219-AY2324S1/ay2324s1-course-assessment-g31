import { SessionDetails, HistoryEntry } from "../../types/types";
import prisma from "../../model/prismaClient";
import { ConsumerFunction } from "./main.interface";

export const sessionEndConsumer: ConsumerFunction = (message) => {
  if (message.value) {
    const sessionDetails: SessionDetails = JSON.parse(message.value.toString());

    const questionAttempt: HistoryEntry = {
      ...sessionDetails,
      attemptDateTime: new Date(),
    };

    // add to db
    prisma.history
      .create({
        data: questionAttempt,
      })
      .then(() => console.log("attempt created"))
      .catch((err) => console.log(`Error creating attempt ${err.message}`));
  }
};
