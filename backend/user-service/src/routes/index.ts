import { Request, Response, Router } from 'express';
import { login, register } from '../controller/userController';

const router = Router();

// register controller
router.route('/register').post(register);

// login controller
router.route('/login').post(login);

// logout controller
router.route('/logout').post();

export default router;