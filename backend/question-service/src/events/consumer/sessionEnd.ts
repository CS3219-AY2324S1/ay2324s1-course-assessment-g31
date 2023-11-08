import prisma from "../../model/prismaClient";
import { ConsumerFunction } from "./main.interface";

export const sessionEndConsumer: ConsumerFunction = (message) => {
  if (message.value) {
    const { questionId } = JSON.parse(message.value.toString());
    console.log(`Event consumed, questionID: ${questionId}`);

    // update attempt in db
    prisma.question
      .update({
        where: { id: questionId },
        data: {
          popularity: {
            increment: 1,
          },
        },
      })
      .then(() => console.log(`question ${questionId} incremented`))
      .catch((err) => console.log(`Error ${err.message}`));
  }
};
