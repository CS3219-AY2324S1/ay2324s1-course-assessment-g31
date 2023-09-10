import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import router from "./routes/questionRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_CONNECTION_STRING || "")
  .then(() => {
    app.listen(port, () => {
      console.log(
        `[server]: Question Service is running at http://localhost:${port}`
      );
    });
  }).catch(err => console.log(err.message))

app.use(morgan("tiny"));
app.use(express.json());

app.use("/", router);



