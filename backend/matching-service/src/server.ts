import app from "./app";
import matchingEventConsumer from "./events/consumers/main";

const port = process.env["PORT"];

app.listen(port, () => {
  console.log(
    `⚡️[server]: Matching Service is running at http://localhost:${port}`
  );

  if (process.env["NODE_ENV"] != "test") {
    matchingEventConsumer().catch((err: Error) => {
      console.error("Error in Matching Service Consumer: ", err);
    });
  }
});
