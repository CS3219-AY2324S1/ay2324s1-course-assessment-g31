"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const userModel_1 = require("../model/userModel");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
/**
 * Creates a new user
 *
 * @param req Incoming HTTP request with the user's credentials
 * @param res Outgoing HTTP response indicating success of user creation
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parameters for users table
        const user_id = (0, uuid_1.v4)();
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        // TODO: Not sure how future implementation of admin vs user role. By default is user role
        const account_type = (yield userModel_1.userFunctions.getIdForUserAccountType()) || 'null';
        const emailTaken = yield userModel_1.userFunctions.isEmailTaken(email);
        if (emailTaken) {
            return res.status(400).json({ message: 'That email is already in use' });
        }
        const hashed_pw = yield bcrypt.hash(password, 8);
        const user = {
            user_id,
            account_type,
            username,
            email,
            hashed_pw
        };
        const userInsertResult = yield userModel_1.userFunctions.insertUser(user);
        return res.status(200).json({ message: 'User registered' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred while registering user' });
    }
});
exports.register = register;
/**
 * Attempts to login a user and authorizes the user if successful
 *
 * @param req Incoming HTTP request with the user's credentials
 * @param res Outgoing HTTP response indicating success of user login
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.userFunctions.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Email or password is wrong.' });
        }
        const passwordMatch = yield bcrypt.compare(password, user.hashed_pw);
        if (passwordMatch) {
            // TODO: Generate session token for user
            res.status(200).json({ user_id: user.user_id });
        }
        else {
            res.status(400).json({ message: 'Invalid Password' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while logging in.' });
    }
});
exports.login = login;
