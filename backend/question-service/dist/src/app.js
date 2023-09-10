"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
mongoose_1.default.connect(process.env.MONGO_CONNECTION_STRING || "")
    .then(() => {
    app.listen(port, () => {
        console.log(`[server]: Question Service is running at http://localhost:${port}`);
    });
}).catch(err => console.log(err.message));
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use("/", questionRoutes_1.default);
