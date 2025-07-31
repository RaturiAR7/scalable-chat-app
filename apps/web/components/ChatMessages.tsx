"use client";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketProvider";
import { useParams } from "next/navigation";

const ChatMessages = () => {
  const { messages, sendMessage, leaveRoom, connect } =
    useContext(SocketContext);
  const { roomId } = useParams();
  const [text, setText] = useState<string>("");
  useEffect(() => {
    if (roomId) connect("join-room", roomId);

    return () => {
      leaveRoom(roomId);
    };
  }, [roomId]);
  console.log(messages);
  return (
    <>
      <div className='flex-1 relative justify-between p-4 overflow-y-auto space-y-3'>
        {messages?.map(
          (message: { msg: string; socketId: string }, index: number) => (
            <div
              key={index}
              className={`max-w-xs w-auto flex px-4 py-2 rounded-2xl ${
                message.socketId == "me"
                  ? "bg-green-600 ml-auto text-right"
                  : "bg-gray-700 mr-auto"
              }`}
            >
              {message.msg}
            </div>
          )
        )}
      </div>
      <div className='p-4 border-t w-full border-gray-700 flex gap-2 fixed bottom-0 bg-gray-800 '>
        <input
          onChange={(e) => {
            setText(e.target.value);
          }}
          type='text'
          className='flex-1 px-4 py-2 rounded-md'
          placeholder='Type your message...'
        />
        <button
          className='bg-green-600 px-4 py-2 rounded-md hover:bg-green-700'
          onClick={() => {
            sendMessage(text, roomId);
          }}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default ChatMessages;
