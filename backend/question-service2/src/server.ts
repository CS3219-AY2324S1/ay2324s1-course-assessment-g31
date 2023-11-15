import app from "./app";
import questionEventConsumer from "./events/consumers/main";
import logger from "./util/logger";

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  logger.info(
    `⚡️[server]: Question Service is running at http://localhost:${port}`,
  );

  if (process.env.NODE_ENV !== "test") {
    questionEventConsumer().catch((err: Error) => {
      logger.error("Error in Question Service Consumer: ", err);
    });
  }
});
