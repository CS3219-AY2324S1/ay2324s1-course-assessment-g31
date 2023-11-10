import io from "socket.io-client";
import { useEffect, useState } from "react";
import ChatLive from "./ChatLive";

const socket = io("http://localhost:9000"); // Corrected the port number

function ChatRoomAdd() {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  useEffect(() => {
    const fetchRoomId = async () => {
      try {
        const response = await fetch("http://localhost:9000/get-room-id");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Room ID:", data.roomId);
        setRoom(data.roomId);
      } catch (error) {
        console.error("Failed to fetch room ID:", error);
      }
    };

    fetchRoomId();
  }, []);

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <h1>THIS IS THE ROOM {room}</h1>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button type="button" onClick={joinRoom}>
            Join A Room
          </button>
        </div>
      ) : (
        <ChatLive socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default ChatRoomAdd;
