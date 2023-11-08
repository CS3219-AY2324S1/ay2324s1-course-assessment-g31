import { Request, Response } from "express";
import prisma from "../model/prismaClient";

export const getAllSolutionsQuestion = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id);
    if (isNaN(questionId)) {
      throw Error("invalid question id");
    }

    const solutions = await prisma.solution.findMany({
      where: { questionId: questionId },
    });
    res.status(200).json(solutions);
  } catch (err: any) {
    res.status(500).json({ error: `Error getting solutions: ${err.message}` });
  }
};

export const getSolution = async (req: Request, res: Response) => {
  try {
    const solutionId = req.params.id;
    const solution = await prisma.solution.findUnique({
      where: { id: solutionId },
    });
    res.status(200).json(solution);
  } catch (err: any) {
    res.status(500).json({ error: `Error getting solution: ${err.message}` });
  }
};

// for testing
export const getAllSolutions = async (req: Request, res: Response) => {
  try {
    const solutions = await prisma.solution.findMany();
    res.status(200).json(solutions);
  } catch (err: any) {
    res.status(500).json({ error: `Error getting solutions: ${err.message}` });
  }
};

interface InputSolution {
  questionId: number;
  title: string;
  code: string;
  description: string;
  language: string;
}

export const createSolution = async (req: Request, res: Response) => {
  try {
    const inputSolution: InputSolution = req.body;
    const addedSolution = await prisma.solution.create({
      data: inputSolution,
    });

    res.status(201).json(addedSolution);
  } catch (err: any) {
    res.status(500).json({ error: `Error getting solution: ${err.message}` });
  }
};

export const updateSolution = async (req: Request, res: Response) => {
  try {
    const solutionId = req.params.id;
    const solution: InputSolution = req.body;

    const solutionOriginal = await prisma.solution.update({
      where: { id: solutionId },
      data: solution,
    });

    res.status(201).json({ solutionOriginal });
  } catch (err: any) {
    res.status(500).json({ error: `Error updating solution: ${err.message}` });
  }
};

export const deleteSolution = async (req: Request, res: Response) => {
  try {
    const solutionId = req.params.id;

    const solution = await prisma.solution.delete({
      where: { id: solutionId },
    });

    if (!solution) {
      res.status(404).json({ error: "Solution Not Found" });
    }

    res.status(201).json({ solution });
  } catch (err: any) {
    res.status(500).json({ error: `Error deleting solution: ${err.message}` });
  }
};
