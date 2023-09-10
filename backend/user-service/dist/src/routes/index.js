"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
// register controller
router.route('/register').post(userController_1.register);
// login controller
router.route('/login').post(userController_1.login);
// logout controller
router.route('/logout').post();
exports.default = router;
