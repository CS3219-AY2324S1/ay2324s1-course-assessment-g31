import { Request, Response, Router } from 'express';
import { login, register, getProfile, deleteProfile, updateProfile, changePassword } from '../controller/userController';

const router = Router();

// register controller
router.route('/register').post(register);

// login controller
router.route('/login').post(login);

/* Profile controller */

// GET user profile
router.route('/profile').post(getProfile);

// DELETE user profile
router.delete("/delete/:id", deleteProfile);

// UPDATE user profile (email and username)
router.put("/update/:id", updateProfile);

// UPDATE user profile (change password)
router.put("/change-password/:id", changePassword);

// TODO: logout

export default router;