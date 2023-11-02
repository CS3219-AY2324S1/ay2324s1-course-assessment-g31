import { Request, Response } from "express";
import prisma from "../model/prismaClient";
import { History } from "@prisma/client";
import {
  Attempt,
  HistoryEntry,
  QuestionAllAttempts,
  SessionDetails,
} from "../types/types";

// get all attempts of all questions by a user
export const getUserAttempts = async (req: Request, res: Response) => {
  const userId: string = req.params.id;
  try {
    const userHistory: History[] = await prisma.history.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    const questionIdToAttemptsMap = new Map<number, Attempt[]>();

    // process data into type QuestionAttemptsAll[]
    userHistory.map((history: History) => {
      const attempt: Attempt = {
        id: history.id,
        attemptDateTime: history.attemptDateTime,
        code: history.code,
        language: history.language,
      };

      if (questionIdToAttemptsMap.has(history.questionId)) {
        questionIdToAttemptsMap.get(history.questionId)!.push(attempt);
      } else {
        questionIdToAttemptsMap.set(history.questionId, [attempt]);
      }
    });

    const questionAttemptsAll: QuestionAllAttempts[] = [];

    // add each questions-attempts pair to array
    questionIdToAttemptsMap.forEach((value: Attempt[], key: number) => {
      questionAttemptsAll.push({
        questionId: key,
        attempts: value,
      });
    });

    res.status(200).json({ history: questionAttemptsAll });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteAttempt = async (req: Request, res: Response) => {
  try {
    const attemptId = req.params.id;

    const deletedAttempt = await prisma.history.delete({
      where: { id: attemptId },
    });

    res.status(200).json({ deletedAttempt });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const testAddAttempt = async (req: Request, res: Response) => {
  try {
    console.log(req);
    const historyEntry: HistoryEntry = {
      questionId: parseInt(req.body.questionId),
      user1Id: req.body.user1Id,
      user2Id: req.body.user2Id,
      code: req.body.code,
      language: req.body.language,
      attemptDateTime: new Date(),
    };

    console.log(historyEntry);

    const history: History = await prisma.history.create({
      data: historyEntry,
    });

    res.status(200).json({ history });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
