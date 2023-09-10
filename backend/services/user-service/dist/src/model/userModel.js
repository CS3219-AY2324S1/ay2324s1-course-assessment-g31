"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFunctions = void 0;
const db_1 = __importDefault(require("../db"));
exports.userFunctions = {
    isEmailTaken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.default.query('SELECT * FROM public.users WHERE email = $1', [email]);
                return !!user; // If 'user' is not null, the email is taken; otherwise, it's not.
            }
            catch (error) {
                console.error('Error checking if email is taken:', error);
                throw error;
            }
        });
    },
    getIdForUserAccountType() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.default.query('SELECT * FROM public.account_type WHERE type = "User"');
                if (user.rows.length > 0) {
                    return user.rows[0].type_id;
                }
                else {
                    return null; // Return null if no matching record is found
                }
            }
            catch (error) {
                console.error('Error getting user account type ID:', error);
                throw error;
            }
        });
    },
    insertUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO public.users (user_id, account_type, username, email, hashed_pw)
                VALUES ($1, $2, $3, $4, $5);
            `;
                const values = [
                    user.user_id,
                    user.account_type,
                    user.username,
                    user.email,
                    user.hashed_pw,
                ];
                yield db_1.default.query(query, values);
            }
            catch (error) {
                console.error('Error inserting user:', error);
                throw error;
            }
        });
    },
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryResult = yield db_1.default.query('SELECT * FROM public.users WHERE email = $1', [email]);
                if (queryResult.rows && queryResult.rows.length > 0) {
                    const user = queryResult.rows[0];
                    return user;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error('Error fetching user by email:', error);
                throw error;
            }
        });
    }
};
