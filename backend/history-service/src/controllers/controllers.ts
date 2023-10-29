import { Request, Response } from "express";
import prisma from "../model/prismaClient";
import { QuestionAttempt } from "@prisma/client";
import { Attempt, QuestionAttemptsAll } from "../types/types";
/*
Consider splitting queries, instead of all attempts of all question, 
first get number of attempts for each question. 
Then individual query for each question to get all its attempts.
Or only send metadata for each attempt(date, language).
Then individual query for attempt code of a question when user selects to view it.
*/

// get all attempts of all questions by a user
export const getUserAttempts = async (req: Request, res: Response) => {
  const userId: string = req.params.id;
  try {
    const attempts: QuestionAttempt[] = await prisma.questionAttempt.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    const questionIdToAttemptsMap = new Map<number, Attempt[]>();

    // process data into type QuestionAttemptsAll[]
    attempts.map((questionAttempt: QuestionAttempt) => {
      const attempt: Attempt = {
        attemptDateTime: questionAttempt.attemptDateTime,
        attemptCode: questionAttempt.attemptCode,
        language: questionAttempt.language,
      };

      if (questionIdToAttemptsMap.has(questionAttempt.questionId)) {
        questionIdToAttemptsMap.get(questionAttempt.questionId)!.push(attempt);
      } else {
        questionIdToAttemptsMap.set(questionAttempt.questionId, [attempt]);
      }
    });

    const questionAttemptsAll: QuestionAttemptsAll[] = [];

    // add each questions-attempts pair to array
    questionIdToAttemptsMap.forEach((value: Attempt[], key: number) => {
      questionAttemptsAll.push({
        questionId: key,
        attempts: value,
      });
    });

    res.status(200).json(questionAttemptsAll);
  } catch (error) {
    res.status(500).json({ error });
  }
};
