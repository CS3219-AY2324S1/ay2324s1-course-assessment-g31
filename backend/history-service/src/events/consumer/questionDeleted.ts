import prisma from "../../model/prismaClient";
import { ConsumerFunction } from "./main.interface";

export const questionDeletedConsumer: ConsumerFunction = (message) => {
  if (message.value) {
    const { questionId } = JSON.parse(message.value.toString());

    prisma.history
      .deleteMany({
        where: {
          questionId: questionId,
        },
      })
      .then((res) => console.log(res.count));
  }
};
