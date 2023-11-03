import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  updateQuestion,
} from "../controller/questionController";
import { decodeAdminToken, decodeToken } from "../middleware/middleware";

const router = Router();

// Get all questions (authorised admin and non-admin can access)
router.get("/all", decodeToken);
router.get("/all", getAllQuestions);

// Create a question (only authorised admin can access)
router.post("/create", decodeAdminToken);
router.post("/create", createQuestion);

// Update a question (only authorised admin can access)
router.patch("/update/:id", decodeAdminToken);
router.patch("/update/:id", updateQuestion);

// Delete a question (only authorised admin can access)
router.delete("/delete/:id", decodeAdminToken);
router.delete("/delete/:id", deleteQuestion);

export default router;
