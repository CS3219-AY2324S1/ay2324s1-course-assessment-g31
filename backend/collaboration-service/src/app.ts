import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import logger from "./util/logger";
import questionEventConsumer from "./kafka/consumer";
import produceEvent, { ProducerTopics } from "./kafka/producer";

dotenv.config();

const app: Express = express();
const server = createServer(app);

const port = process.env.SERVER_PORT;

const events = new Map<string, string>([
  ["join", "joined"],
  ["begin-collaboration", "collaboration-begun"],
  ["change-code", "code-changed"],
  ["change-language", "language-changed"],
  ["cancel-collaboration", "collaboration-cancelled"],
]);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.userId);
    logger.info(`User ${data.userId} joined`);
    io.to(data.userId).emit(events.get("join")!, `User ${data.userId} joined`);
  });

  socket.on("begin-collaboration", (data) => {
    const roomId = data.requestId;
    socket.join(roomId);
    logger.info(`User:${data.userId} joined Room:${roomId}`);
    io.to(roomId).emit(
      events.get("begin-collaboration")!,
      `User:${data.userId} joined Room:${roomId}`,
    );
  });

  socket.on("change-code", (data) => {
    logger.info(
      `Editing Code Matching: ${data.requestId} \t User Id: ${data.userId} \t Code: ${data.code}`,
    );
    io.to(data.requestId).emit(events.get("change-code")!, data);
  });

  socket.on("change-language", (data) => {
    logger.info(
      `Change Language: ${data.requestId} \t User Id: ${data.userId} \t to Language: ${data.language}`,
    );
    io.to(data.requestId).emit(events.get("change-language")!, data);
  });

  socket.on("cancel-collaboration", (data) => {
    logger.info(
      `Cancelling Matching: ${data.requestId} \t User Id: ${data.userId}`,
    );
    io.to(data.requestId).emit(events.get("cancel-collaboration")!, data);
    produceEvent(ProducerTopics.COLLABORATION_END, [
      {
        key: data.requestId.toString(),
        value: JSON.stringify({
          questionId: data.questionId,
          user1Id: data.userId,
          user2Id: data.matchedUserId,
          code: data.code,
          language: data.language,
        }),
      },
    ]);
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Socket Server");
});

server.listen(port, () => {
  logger.info(
    `⚡️[server]: Question Service is running at http://localhost:${port}`,
  );

  questionEventConsumer(io).catch((err: any) => {
    logger.error("Error in Question Service Consumer: ", err);
  });
});

export default server;
