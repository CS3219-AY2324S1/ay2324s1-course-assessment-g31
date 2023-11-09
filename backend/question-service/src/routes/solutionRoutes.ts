import { Router } from "express";
import {
  createSolution,
  deleteSolution,
  getAllSolutions,
  getAllSolutionsQuestion,
  getSolution,
  updateSolution,
} from "../controller/solutionController";

const solutionRouter = Router();

solutionRouter.get("/", getAllSolutions);
solutionRouter.get("/question/:id", getAllSolutionsQuestion);
solutionRouter.get("/:id", getSolution);
solutionRouter.post("/", createSolution);
solutionRouter.patch("/:id", updateSolution);
solutionRouter.delete("/:id", deleteSolution);

export default solutionRouter;
