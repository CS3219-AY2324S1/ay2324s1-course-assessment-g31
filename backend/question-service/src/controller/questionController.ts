import { Request, Response } from "express";
import { PrismaClient, Category, Complexity } from "@prisma/client";

const prisma = new PrismaClient();

type Question = {
  title: string;
  complexity: Complexity;
  category: Category[];
  description: string;
};

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await prisma.question.findMany();
    res.status(200).json(questions);
  } catch (err: any) {
    res.status(500).json({ error: "Error getting questions" });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  const question: Question = req.body;
  try {
    const questionResult = await prisma.question.create({
      data: question,
    });
    res.status(201).json({ questionResult });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  const { id: questionId } = req.params;
  const question: Question = req.body;
  try {
    const questionOriginal = await prisma.question.update({
      where: { id: questionId },
      data: question,
    });
    res.status(201).json({ questionOriginal });
  } catch (err: any) {
    res.status(500).json({ error: "Error updating question" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id: questionId } = req.params;
  try {
    const question = await prisma.question.delete({
      where: { id: questionId },
    });
    if (!question) {
      res.status(404).json({ error: "Question Not Found" });
    }

    res.status(201).json({ question });
  } catch (err: any) {
    res.status(500).json({ error: "Error updating question" });
  }
};
