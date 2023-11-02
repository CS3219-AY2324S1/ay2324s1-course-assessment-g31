import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from "../controller/questionController";

const router = Router();

router.get("/get/:id", getQuestion);
router.get("/all", getAllQuestions);
router.post("/create", createQuestion);
router.patch("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);

export default router;
