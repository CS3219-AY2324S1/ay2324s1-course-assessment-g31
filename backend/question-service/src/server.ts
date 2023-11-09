import express, { Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import questionRouter from "./routes/questionRoutes";
import cors from "cors";
import solutionRouter from "./routes/solutionRoutes";
import EventConsumer from "./events/consumer/main";

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT;

// TODO configure to be more specific
app.use(cors());

app.use(morgan("tiny"));
app.use(express.json());

app.use("/question", questionRouter);
app.use("/solution", solutionRouter);

app.listen(port, () => {
  console.log(
    `[server]: Question Service is running at http://localhost:${port}`
  );
  if (process.env.NODE_ENV !== "test") {
    EventConsumer().catch((err: Error) => console.log(err.message));
  }
});
