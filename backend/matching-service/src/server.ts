import app from "./app";
import matchingEventConsumer from "./events/consumers/main";
import logger from "./util/logger";

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  logger.info(
    `⚡️[server]: Matching Service is running at http://localhost:${port}`,
  );

  if (process.env.NODE_ENV !== "test") {
    matchingEventConsumer().catch((err: Error) => {
      logger.error("Error in Matching Service Consumer: ", err);
    });
  }
});
