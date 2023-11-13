import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import EventConsumer from "./events/consumer/main";
import HistoryService from "./services/history/history.service";
import prismaClient from "./util/prisma/client";
import HistoryParser from "./parsers/history/history.parser";
import HistoryController from "./controllers/history/history.controller";
import HistoryRouter from "./routers/history/router";

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Services
const historyService = new HistoryService(prismaClient);

// Parsers
const historyParser = new HistoryParser();

// Controllers
const historyController = new HistoryController(historyService, historyParser);

const historyRouter = new HistoryRouter(historyController, express.Router());

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/healthCheck", (_req, res) => {
  res.send("OK");
});
app.use("/api/history", historyRouter.registerRoutes());

app.listen(port, () => {
  console.log(
    `⚡️[server]: History Service is running at http://localhost:${port}`
  );

  if (process.env.NODE_ENV !== "test") {
    EventConsumer().catch((err: Error) => console.log(err.message));
  }
});
