import { useEffect, useState, FormEvent } from "react";
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

function formatTimeToAMPM(time: string): string {
  const [hours, minutes] = time.split(":");
  let formattedTime = "";
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  if (hour === 0) {
    formattedTime = `12:${minute < 10 ? "0" : ""}${minute} AM`;
  } else if (hour < 12) {
    formattedTime = `${hour}:${minute < 10 ? "0" : ""}${minute} AM`;
  } else if (hour === 12) {
    formattedTime = `12:${minute < 10 ? "0" : ""}${minute} PM`;
  } else {
    formattedTime = `${hour - 12}:${minute < 10 ? "0" : ""}${minute} PM`;
  }

  return formattedTime;
}

function ChatLive({ socket, username, room }: ChatProps) {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (currentMessage !== "") {
      const currentDateTime = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
      };
      const formattedTime = currentDateTime.toLocaleTimeString([], options);

      const messageData: MessageData = {
        room,
        author: username,
        message: currentMessage,
        time: formatTimeToAMPM(formattedTime), // Format time as AMPM
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
    <div className="border rounded-lg shadow p-5">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
        Chat
      </h2>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              key={index.toString()}
              className="flex space-x-4 text-sm text-gray-500"
              id={username === messageContent.author ? "you" : "other"}
            >
              <div className="flex flex-col items-start">
                <div className="flex justify-between items-center">
                  <h1 className="font-medium text-xl text-gray-900">{messageContent.author}</h1>
                  <div className="message-meta" style={{ marginLeft: '8px' }}>
                    <p id="time">{messageContent.time}</p> {/* Format time as AMPM */}
                  </div>
                </div>
                <div className="mt-2 max-w-none">
                  <p className="prose prose-sm text-gray-500 break-words">
                    {messageContent.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="min-w-0 flex-1">
        <form className="relative" onSubmit={sendMessage}>
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label htmlFor="new-comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              name="comment"
              id="new-comment"
              className="block w-full resize-none border-0 bg-transparent py-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              value={currentMessage}
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
            />
            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex-col">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatLive;
