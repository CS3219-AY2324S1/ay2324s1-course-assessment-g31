import { Router } from "express";
import { getUserAttempts } from "../controllers/controllers";

const router = Router();

router.get("/:id", getUserAttempts);

export default router;
