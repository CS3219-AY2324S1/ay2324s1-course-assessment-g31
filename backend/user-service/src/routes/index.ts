import { Request, Response, Router } from "express";
import {
  // login,
  register,
  getProfile,
  deleteProfile,
  updateProfile,
  changePassword,
  changeUsername,
  getRole,
} from "../controller/userController";

const router = Router();

// register controller
router.post("/register", register);

// login controller
// router.post("/login", login);

/* Profile controller */

// GET user profile
router.get("/profile/:id", getProfile);

// GET user profile
router.get("/userRole/:id", getRole);

// DELETE user profile
router.delete("/delete/:id", deleteProfile);

// UPDATE user profile (email and username)
router.put("/update/:id", updateProfile);

// UPDATE user profile (change password)
router.put("/change-password/:id", changePassword);

// UPDATE user profile (change username)
router.put("/change-username/:id", changeUsername);

// TODO: logout

export default router;
