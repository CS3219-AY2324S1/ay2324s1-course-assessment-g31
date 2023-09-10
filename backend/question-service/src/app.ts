import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import router from "./routes/questionRoutes";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING || "")
  .then(() => {
    app.listen(port, () => {
      console.log(
        `[server]: Question Service is running at http://localhost:${port}`
      );
    });
  })
  .catch((err) => console.log(err.message));

// TODO configure to be more specific
app.use(cors());

app.use(morgan("tiny"));
app.use(express.json());

app.use("/", router);
