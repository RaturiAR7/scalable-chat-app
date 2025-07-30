"use client";
import { useContext, useState } from "react";
import { SocketContext } from "../context/SocketProvider";

const ChatMessages = () => {
  const { messages, sendMessage }: string[] | null = useContext(SocketContext);
  const [text, setText] = useState<string>("");
  console.log("Chat Messages", messages);
  return (
    <>
      <div className='flex-1 relative justify-between p-4 overflow-y-auto space-y-3'>
        {messages?.map((message: string, index: number) => (
          <div
            key={index}
            className={`max-w-xs w-auto flex px-4 py-2 rounded-2xl ${
              "other" === "me"
                ? "bg-green-600 ml-auto text-right"
                : "bg-gray-700 mr-auto"
            }`}
          >
            {message}
          </div>
        ))}
      </div>
      <div className='p-4 border-t w-full border-gray-700 flex gap-2 fixed bottom-0 bg-gray-800'>
        <input
          onChange={(e) => {
            setText(e.target.value);
          }}
          type='text'
          className='flex-1 px-4 py-2 rounded-md text-black'
          placeholder='Type your message...'
        />
        <button
          className='bg-green-600 px-4 py-2 rounded-md hover:bg-green-700'
          onClick={() => {
            sendMessage(text);
          }}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default ChatMessages;
