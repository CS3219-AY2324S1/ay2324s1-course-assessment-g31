import { Request, Response, Router } from "express";
import {
  login,
  register,
  getProfile,
  deleteProfile,
  updateProfile,
  changePassword,
} from "../controller/userController";

const router = Router();

// register controller
router.post("/register", register);

// login controller
router.post("/login", login);

/* Profile controller */

// GET user profile
router.get("/profile/:id", getProfile);

// DELETE user profile
router.delete("/delete/:id", deleteProfile);

// UPDATE user profile (email and username)
router.put("/update/:id", updateProfile);

// UPDATE user profile (change password)
router.put("/change-password/:id", changePassword);

// TODO: logout

export default router;
