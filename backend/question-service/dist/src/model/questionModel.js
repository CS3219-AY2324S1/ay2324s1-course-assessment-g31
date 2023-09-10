"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var Complexity;
(function (Complexity) {
    Complexity["Easy"] = "EASY";
    Complexity["Medium"] = "MEDIUM";
    Complexity["Hard"] = "HARD";
})(Complexity || (Complexity = {}));
const questionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    complexity: { type: String, required: true },
    description: { type: String, required: true },
});
const Question = (0, mongoose_1.model)('Question', questionSchema);
exports.default = Question;
