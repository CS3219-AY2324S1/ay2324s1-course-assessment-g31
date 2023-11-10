import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

interface MessageData {
  room: string;
  author: string;
  message: string;
  time: string;
}

interface ChatProps {
  socket: any;
  username: string;
  room: string;
}

function ChatLive({ socket, username, room }: ChatProps) {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: MessageData = {
        room,
        author: username,
        message: currentMessage,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now(),
        ).getMinutes()}`,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data: MessageData) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [socket, username]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              key={index.toString()} // Change key to string
              className="message"
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button type="button" onClick={sendMessage}>
          ▶
        </button>
      </div>
    </div>
  );
}

export default ChatLive;
