import { Request, Response, Router } from "express";
import {
  register,
  getProfile,
  deleteProfile,
  changeUsername,
  getRole,
} from "../controller/userController";
import { decodeToken } from "../middleware/middleware";

const router = Router();

// register controller
router.post("/register", register);

/* Profile controller */

// GET user profile
router.get("/profile/:id", decodeToken);
router.get("/profile/:id", getProfile);

// GET user role
router.get("/userRole/:id", decodeToken);
router.get("/userRole/:id", getRole);

// DELETE user profile
router.delete("/delete/:id", decodeToken);
router.delete("/delete/:id", deleteProfile);

// UPDATE user profile (change username)
router.put("/change-username/:id", decodeToken);
router.put("/change-username/:id", changeUsername);

export default router;
