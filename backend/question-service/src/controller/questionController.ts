import { Request, Response } from "express";
import Question, { IQuestion } from "../model/questionModel";

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch {
    res.status(500).json({ error: "Error getting questions" });
  }
}

export const createQuestion = async (req: Request, res: Response) => {
  const question: IQuestion = req.body;
  try {
    const questionResult = await Question.create(question);
    res.status(201).json({ questionResult });
  } catch {
    res.status(500).json({ error: "Error creating question" });
  }
}

export const updateQuestion = async (req: Request, res: Response) => {
  const { id: questionId } = req.params;
  const question: IQuestion = req.body;
  try {
    const questionOriginal = await Question.findByIdAndUpdate(questionId, question);
    res.status(201).json({ questionOriginal });
  } catch {
    res.status(500).json({ error: "Error updating question" });
  }
}

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id: questionId } = req.params;
  try {
    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      res.status(404).json({ error: "Question Not Found" });
    }

    res.status(201).json({ question });
  } catch {
    res.status(500).json({ error: "Error updating question" });
  }
}
