import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  // Get All Video Calls
  res.send("Video Call Service Server");
});

app.post("/", (req: Request, res: Response) => {
  // Create a single Video Call
  res.send("Create single Video Call");
});

app.put("/", (req: Request, res: Response) => {
  // Update a single Video Call
  res.send("Update single Video Call");
});

app.delete("/", (req: Request, res: Response) => {
  // Delete a single Video Call
  res.send("Delete single Video Call");
});

app.listen(port, () => {
  console.log(
    `⚡️[server]: Video Call Service is running at http://localhost:${port}`
  );
});
