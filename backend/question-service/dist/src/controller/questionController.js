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
exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getAllQuestions = void 0;
const questionModel_1 = __importDefault(require("../model/questionModel"));
const getAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield questionModel_1.default.find();
        res.status(200).json(questions);
    }
    catch (_a) {
        res.status(500).json({ error: "Error getting questions" });
    }
});
exports.getAllQuestions = getAllQuestions;
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, complexity, description } = req.body;
    try {
        const question = yield questionModel_1.default.create({ title, complexity, description });
        res.status(201).json({ question });
    }
    catch (_b) {
        res.status(500).json({ error: "Error creating question" });
    }
});
exports.createQuestion = createQuestion;
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: questionId } = req.params;
    const { title, complexity, description } = req.body;
    try {
        const question = yield questionModel_1.default.findByIdAndUpdate(questionId, { title, complexity, description });
        res.status(201).json({ question });
    }
    catch (_c) {
        res.status(500).json({ error: "Error updating question" });
    }
});
exports.updateQuestion = updateQuestion;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: questionId } = req.params;
    try {
        const question = yield questionModel_1.default.findByIdAndDelete(questionId);
        if (!question) {
            res.status(404).json({ error: "Question Not Found" });
        }
        res.status(201).json({ question });
    }
    catch (_d) {
        res.status(500).json({ error: "Error updating question" });
    }
});
exports.deleteQuestion = deleteQuestion;
