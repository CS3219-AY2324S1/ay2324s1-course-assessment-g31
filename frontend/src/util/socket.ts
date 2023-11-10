import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://socket-service-qzxsy455sq-as.a.run.app"
    : "localhost:5004";

const socket = io(URL, { autoConnect: false });

export default socket;
