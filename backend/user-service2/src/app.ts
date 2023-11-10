import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";

import UserController from "./controllers/user/user.controller";
import kafka from "./events/kafka";
import UserProducer from "./events/producers/user/producer";
import UserParser from "./parsers/user/user.parser";
import UserRouter from "./routers/user/router";
import UserService from "./services/user/user.service";
import prismaClient from "./util/prisma/client";

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Event Producer
const userEventProducer = new UserProducer(kafka.producer());

// Services
const userService = new UserService(prismaClient);

// Parsers
const userParser = new UserParser();

// Controllers
const userController = new UserController(
  userService,
  userParser,
  userEventProducer,
);

// Routers
const userRouter = new UserRouter(userController, express.Router());

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api/healthCheck", (_req, res) => {
  res.send("OK");
});
app.use("/api/user", userRouter.registerRoutes());

export default app;
