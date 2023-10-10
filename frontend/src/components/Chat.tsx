import React from "react";

import classNames from "../util/ClassNames";

interface IMessage {
  id: number;
  sender: string;
  message: string;
  date: Date;
}

function Chat() {
  // Sample Message Data
  const messages: IMessage[] = [
    {
      id: 1,
      sender: "John Doe",
      message: "Hello, how are you?",
      date: new Date(),
    },
    {
      id: 2,
      sender: "Jane Doe",
      message: "I am good, how about you?",
      date: new Date(),
    },
  ];

  const [message, setMessage] = React.useState<string>("");

  // Send Message using peerjs
  const sendMessage = () => {};

  return (
    <div className="border rounded-lg shadow p-5">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
        Chat
      </h2>

      <div className="">
        {messages.map((msg, msgIdx) => (
          <div key={msg.id} className="flex space-x-4 text-sm text-gray-500">
            <div
              className={classNames(
                msgIdx === 0
                  ? ""
                  : "border-t border-gray-200 dark:border-gray-800",
                "flex-1 py-5",
              )}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">{msg.sender}</h3>
                <p>
                  <time dateTime={msg.date.toLocaleTimeString()}>
                    {msg.date.toLocaleTimeString()}
                  </time>
                </p>
              </div>

              <div className="mt-2 max-w-none">
                <p className="prose prose-sm text-gray-500">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
    </div>
  );
}

export default Chat;
