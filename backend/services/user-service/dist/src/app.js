"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.listen(3000, () => {
    console.log(`⚡️[server]: Authentication Service is running at http://localhost:3000`);
});
app.get("/", (req, res) => {
    res.send("Welcome to the authentication service.");
});
// routes
app.use("/user-services", routes_1.default);
// Test database connection
db_1.default.query('SELECT * FROM public.category', (err, result) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
    console.log('Results', result.rows);
    db_1.default.end();
});
