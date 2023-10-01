import { Request, Response, Router } from "express";
import {
  // login,
  register,
  getProfile,
  deleteProfile,
  changeUsername,
  getRole,
} from "../controller/userController";

const router = Router();

// register controller
router.post("/register", register);

/* Profile controller */

// GET user profile
router.get("/profile/:id", getProfile);

// GET user profile
router.get("/userRole/:id", getRole);

// DELETE user profile
router.delete("/delete/:id", deleteProfile);

// UPDATE user profile (change username)
router.put("/change-username/:id", changeUsername);

// TODO: logout

export default router;
