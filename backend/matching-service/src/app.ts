import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";

import MatchingController from "./controllers/matching/matching.controller";
import MatchingRequestController from "./controllers/matchingRequest/matchingRequest.controller";
import kafka from "./events/kafka";
import MatchingRequestProducer from "./events/producers/matchingRequest/producer";
import MatchingParser from "./parsers/matching/matching.parser";
import MatchingRequestParser from "./parsers/matchingRequest/matchingRequest.parser";
import MatchingRouter from "./routers/matching/router";
import MatchingRequestRouter from "./routers/matchingRequest/router";
import MatchingService from "./services/matching/matching.service";
import MatchingRequestService from "./services/matchingRequest/matchingRequest.service";
import prismaClient from "./util/prisma/client";
import MatchingProducer from "./events/producers/matching/producer";
import { Partitioners } from "kafkajs";

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Event Producer
const matchingEventProducer = new MatchingProducer(
  kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner }),
);

const matchingRequestEventProducer = new MatchingRequestProducer(
  kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner }),
);

// Services
const matchingService = new MatchingService(prismaClient);
const matchingRequestService = new MatchingRequestService(prismaClient);

// Parsers
const matchingParser = new MatchingParser();
const matchingRequestParser = new MatchingRequestParser();

// Controllers
const matchingController = new MatchingController(
  matchingService,
  matchingParser,
  matchingEventProducer,
);
const matchingRequestController = new MatchingRequestController(
  matchingRequestService,
  matchingRequestParser,
  matchingRequestEventProducer,
);

// Routers
const matchingRouter = new MatchingRouter(matchingController, express.Router());

const matchingRequestRouter = new MatchingRequestRouter(
  matchingRequestController,
  express.Router(),
);

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api/healthCheck", (_req, res) => {
  res.send("OK");
});
app.use("/api/matching", matchingRouter.registerRoutes());
app.use("/api/matchingRequest", matchingRequestRouter.registerRoutes());

export default app;
