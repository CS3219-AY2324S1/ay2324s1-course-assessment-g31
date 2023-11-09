import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  getRandomQuestion,
  updateQuestion,
} from "../controller/questionController";

const questionRouter = Router();

questionRouter.get("/", getAllQuestions);
questionRouter.get("/random", getRandomQuestion);
questionRouter.get("/:id", getQuestion);
questionRouter.post("/", createQuestion);
questionRouter.patch("/:id", updateQuestion);
questionRouter.delete("/:id", deleteQuestion);

export default questionRouter;
