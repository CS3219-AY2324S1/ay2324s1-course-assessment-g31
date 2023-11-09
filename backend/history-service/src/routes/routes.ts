import { Router } from "express";
import {
  deleteAttempt,
  getUserAttempts,
  getUserQuestionAttempts,
  testAddAttempt,
} from "../controllers/controllers";

const router = Router();

router.get("/:uid/:qid", getUserQuestionAttempts);

router.post("/add", testAddAttempt);

router.get("/:id", getUserAttempts);

router.delete("/:id", deleteAttempt);

export default router;
