import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://localhost:5004"
    : "localhost:5004";

const socket = io(URL, { autoConnect: false });

export default socket;
