"use client";
import { useContext } from "react";
import { SocketContext } from "../context/SocketProvider";

const ChatMessages = () => {
  const { messages }: string[] | null = useContext(SocketContext);
  console.log("Chat Messages", messages);
  return (
    <div className='flex-1 justify-between p-4 overflow-y-auto space-y-3'>
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
  );
};

export default ChatMessages;
