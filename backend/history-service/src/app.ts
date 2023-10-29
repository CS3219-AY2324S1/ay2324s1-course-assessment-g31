import express, { Express } from "express";
import dotenv from "dotenv";
import router from "./routes/routes";
import cors from "cors";
import EventConsumer from "./events/consumer/main";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use("/", router);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Video Call Service is running at http://localhost:${port}`
  );

  if (process.env.NODE_ENV !== "test") {
    EventConsumer().catch((err: Error) => console.log(err.message));
  }
});
