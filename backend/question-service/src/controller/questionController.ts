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
  const {title, complexity, description}: IQuestion = req.body;
  try {
    const question = await Question.create({ title, complexity, description });
    res.status(201).json({ question });
  } catch {
    res.status(500).json({ error: "Error creating question" });
  }
}

export const updateQuestion = async (req: Request, res: Response) => {
  const { id: questionId } = req.params;
  const {title, complexity, description}: IQuestion = req.body;
  try {
    const question = await Question.findByIdAndUpdate(questionId, {title, complexity, description});
    res.status(201).json({ question });
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
