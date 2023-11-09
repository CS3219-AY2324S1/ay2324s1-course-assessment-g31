import prisma from "../../model/prismaClient";
import { ConsumerFunction } from "./main.interface";

export const sessionEndConsumer: ConsumerFunction = (message) => {
  if (message.value) {
    const { questionId } = JSON.parse(message.value.toString());

    // update attempt in db
    prisma.question.update({
      where: { id: questionId },
      data: {
        popularity: {
          increment: 1,
        },
      },
    });
  }
};
