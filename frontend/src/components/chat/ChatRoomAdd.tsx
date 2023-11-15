import io from "socket.io-client";
import { useEffect, useCallback, useMemo, useState } from "react";
import ChatLive from "./ChatLive";
import { useAuth } from "../../context/AuthContext";
import UserController from "../../controllers/user/user.controller";

const socket = io("http://localhost:9000"); // Corrected the port number

interface ChatRoomAddProps {
  matchingId: string;
}

function ChatRoomAdd({ matchingId }: ChatRoomAddProps) {
  const { currentUser } = useAuth();
  const userController = useMemo(() => new UserController(), []);

  const [username, setUsername] = useState("");

  const fetchProfileData = useCallback(async () => {
    try {
      if (currentUser !== null) {
        const res = await userController.getUser(currentUser.uid);
        console.log(res);

        if (!res || !res.data) {
          console.error("Failed to fetch profile: ", res.statusText);
        } else {
          console.log("Successfully fetched username: ", res.data.username);
          setUsername(res.data.username);
        }
      } else {
        console.log("Unauthenticated access");
      }
    } catch (error: any) {
      console.log("Error fetching profile data:", error.message);
    }
  }, [currentUser, userController]);

  useEffect(() => {
    const joinRoom = () => {
      if (username !== "" && matchingId !== "") {
        socket.emit("join_room", matchingId);
      }
    };

    joinRoom();
    fetchProfileData();
  }, [matchingId, username, fetchProfileData]);

  return (
    <div className="App">
      <ChatLive socket={socket} username={username} room={matchingId} />
    </div>
  );
}

export default ChatRoomAdd;
