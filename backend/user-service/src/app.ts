import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000; //TODO: remove default once dockerized

// logging for debugging
app.use(morgan("tiny"));

app.use(express.json());

// Configure CORS to allow requests from http://localhost:8080
app.use(cors({ origin: "http://localhost:8080" }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the authentication service.");
});

// routes
app.use("/user-services", router);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Authentication Service is running at http://localhost:${port}`
  );
});
