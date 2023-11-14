import app from "./app";
import userEventConsumer from "./events/consumers/main";
import logger from "./util/logger";

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  logger.info(
    `⚡️[server]: User Service is running at http://localhost:${port}`,
  );

  if (process.env.NODE_ENV !== "test") {
    userEventConsumer().catch((err: Error) => {
      logger.error("Error in User Service Consumer: ", err);
    });
  }
});
