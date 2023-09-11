import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import cors from "cors";
import db from './db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// Configure CORS to allow requests from http://localhost:8080
app.use(cors({ origin: "http://localhost:8080" }));

app.listen(3000, () => {
  console.log(
    `⚡️[server]: Authentication Service is running at http://localhost:3000`
  );
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the authentication service.");
});

// routes
app.use("/user-services", router);



