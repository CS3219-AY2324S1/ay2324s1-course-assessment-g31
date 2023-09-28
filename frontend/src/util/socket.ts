import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://localhost:5006"
    : "localhost:5006";

const socket = io(URL, { autoConnect: false });

export default socket;
