import { Request, Response } from "express";
import { Category, Difficulty } from "@prisma/client";
import { getRandomInt } from "../util/util";
import prisma from "../model/prismaClient";

type QuestionInput = {
  title: string;
  difficulty: Difficulty;
  category: Category[];
  description: string;
  example: string;
};

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id);
    if (isNaN(questionId)) {
      throw Error("invalid question id");
    }
    const question = await prisma.question.findUnique({
      select: {
        id: true,
        title: true,
        category: true,
        difficulty: true,
        description: true,
        example: true,
        popularity: true,
        solutions: true,
      },
      where: { id: questionId },
    });
    res.status(200).json(question);
  } catch (err: any) {
    res.status(500).json({ error: `Error getting question: ${err.message}` });
  }
};

interface IReqQueryGetAllQuestions {
  sortBy: string; // title, popularity
  order: "asc" | "desc"; // asc, desc
  title: string;
  difficulty: Difficulty;
  category: Category[];
  limit: number;
  offset: number;
}

export const getAllQuestions = async (
  req: Request<{}, {}, {}, IReqQueryGetAllQuestions>,
  res: Response
) => {
  var {
    sortBy,
    order = "asc",
    title: titleFilter,
    difficulty: difficultyFilter,
    category: categoryFilter = [],
    limit = 50,
    offset = 0,
  } = req.query;

  if (!Array.isArray(categoryFilter)) {
    categoryFilter = [categoryFilter];
  }

  try {
    const count = await prisma.question.count({
      where: {
        AND: [
          difficultyFilter ? { difficulty: difficultyFilter } : {},
          titleFilter
            ? { title: { contains: titleFilter, mode: "insensitive" } }
            : {},
          categoryFilter ? { category: { hasEvery: categoryFilter } } : {},
        ],
      },
    });

    const questions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        category: true,
        popularity: true,
      },
      where: {
        AND: [
          difficultyFilter ? { difficulty: difficultyFilter } : {},
          titleFilter
            ? { title: { contains: titleFilter, mode: "insensitive" } }
            : {},
          categoryFilter ? { category: { hasEvery: categoryFilter } } : {},
        ],
      },
      orderBy:
        sortBy === "title"
          ? { title: order }
          : sortBy === "popularity"
          ? { popularity: order }
          : {},
      skip: offset,
      take: limit,
    });

    const result = {
      count: count,
      results: questions,
    };

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Error getting questions: ${err.message}` });
  }
};

interface IReqQueryRandomQuestion {
  difficulty: Difficulty;
}
export const getRandomQuestion = async (
  req: Request<{}, {}, {}, IReqQueryRandomQuestion>,
  res: Response
) => {
  const { difficulty = "Easy" } = req.query;
  try {
    const questionIds = await prisma.question.findMany({
      select: { id: true },
      where: { difficulty: difficulty },
    });

    if (questionIds.length === 0) {
      throw new Error(`No questions found ${difficulty}`);
    }
    const idToGet = questionIds.at(getRandomInt(0, questionIds.length))?.id;

    const question = await prisma.question.findUnique({
      where: { id: idToGet },
    });

    res.status(200).json(question);
  } catch (err: any) {
    res.status(500).json({ error: `Error getting question: ${err.message}` });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  const question: QuestionInput = req.body;
  try {
    const questionResult = await prisma.question.create({
      data: question,
    });
    res.status(201).json({ questionResult });
  } catch (err: any) {
    res.status(500).json({ error: `Error creating question: ${err.message}` });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id);
    const question: QuestionInput = req.body;
    if (isNaN(questionId)) {
      throw Error("invalid question id");
    }

    const questionOriginal = await prisma.question.update({
      where: { id: questionId },
      data: question,
    });

    res.status(201).json({ questionOriginal });
  } catch (err: any) {
    res.status(500).json({ error: `Error updating question: ${err.message}` });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id);
    if (isNaN(questionId)) {
      throw Error("invalid question id");
    }

    const question = await prisma.question.delete({
      where: { id: questionId },
    });

    if (!question) {
      res.status(404).json({ error: "Question Not Found" });
    }

    /*
    // produce deleted event
    produceEvent(ProducerTopics.QUESTION_DELETED, [
      {
        key: questionId.toString(),
        value: JSON.stringify({
          questionId,
        }),
      },
    ]);*/

    res.status(201).json({ question });
  } catch (err: any) {
    res.status(500).json({ error: `Error deleting question: ${err.message}` });
  }
};
