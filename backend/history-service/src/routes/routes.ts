import { Router } from "express";
import {
  deleteAttempt,
  getUserAttempts,
  testAddAttempt,
} from "../controllers/controllers";

const router = Router();

router.post("/add", testAddAttempt);

router.get("/:id", getUserAttempts);

router.delete("/:id", deleteAttempt);

export default router;
