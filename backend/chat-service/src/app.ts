import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import chatEventConsumer from './events/kafka/consumer';
import eventBus from './events/util/eventBus';

const app = express();
app.use(cors());

const server = http.createServer(app);
let roomId = 1000000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

  socket.on("matching-created", (message) => {
    // Assuming the message is a JSON string that contains roomId
    console.log("matching-created topic received")
    try {
      const data = JSON.parse(message);
      roomId = data;
      console.log(`Room ID received: ${roomId}`);
      // if (data && data.id) {
      //   // roomId = data.id;
      //   // console.log(`Room ID received: ${roomId}`);
      // }
    } catch (error) {
      console.error("Error parsing roomId from message", error);
    }
  });
});

app.get("/get-room-id", (req, res) => {
  if (roomId) {
    res.json({ roomId });
  } else {
    res.status(404).json({ error: 'Room ID not found' });
  }
});

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
  chatEventConsumer(io).catch((error) => {
    console.error('Error in Kafka Consumer:', error);
  });
});
