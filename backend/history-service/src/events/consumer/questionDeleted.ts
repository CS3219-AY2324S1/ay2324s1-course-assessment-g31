import prismaClient from "../../util/prisma/client";
import { ConsumerFunction } from "./main.interface";

export const questionDeletedConsumer: ConsumerFunction = (message) => {
  if (message.value) {
    let { questionId } = JSON.parse(message.value.toString());

    questionId = parseInt(questionId, 10);
    if (Number.isNaN(questionId)) {
      throw new Error("Invalid qestionId");
    }

    prismaClient.history
      .deleteMany({
        where: {
          questionId: questionId,
        },
      })
      .then((res: any) => console.log(`${res.count} history deleted`));
  }
};
