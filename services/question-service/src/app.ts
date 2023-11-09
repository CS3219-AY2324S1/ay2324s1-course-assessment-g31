import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";

import QuestionController from "./controllers/question/question.controller";
import kafka from "./events/kafka";
import QuestionProducer from "./events/producers/question/producer";
import QuestionParser from "./parsers/question/question.parser";
import QuestionRouter from "./routers/question/router";
import QuestionService from "./services/question/question.service";
import prismaClient from "./util/prisma/client";

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Event Producer
const questionEventProducer = new QuestionProducer(kafka.producer());

// Services
const questionService = new QuestionService(prismaClient);

// Parsers
const questionParser = new QuestionParser();

// Controllers
const questionController = new QuestionController(
  questionService,
  questionParser,
  questionEventProducer,
);

// Routers
const questionRouter = new QuestionRouter(questionController, express.Router());

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api/healthCheck", (_req, res) => {
  res.send("OK");
});
app.use("/api/question", questionRouter.registerRoutes());

export default app;
