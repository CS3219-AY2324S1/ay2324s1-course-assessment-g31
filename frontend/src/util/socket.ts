import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://localhost:5006"
    : "localhost:5006";

export const socket = io(URL, { autoConnect: false });
