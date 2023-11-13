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

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api/healthCheck", (_req, res) => {
  res.send("OK");
});
app.use("/api/users", userRouter.registerRoutes());

export default app;
