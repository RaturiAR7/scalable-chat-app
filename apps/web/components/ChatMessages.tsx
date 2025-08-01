"use client";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketProvider";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const ChatMessages = () => {
  const socketContext = useContext(SocketContext);
  const messages = socketContext?.messages;
  const sendMessage = socketContext?.sendMessage;
  const leaveRoom = socketContext?.leaveRoom;
  const connect = socketContext?.connect;
  const { roomId } = useParams();
  const [text, setText] = useState<string>("");
  const session = useSession();

  useEffect(() => {
    if (roomId) {
      if (connect && roomId != undefined) {
        connect(
          "join-room",
          Array.isArray(roomId) ? (roomId[0] ?? "") : (roomId ?? ""),
          session.data?.user?.name || "Guest"
        );
      }
    }

    return () => {
      if (leaveRoom && roomId) {
        leaveRoom(Array.isArray(roomId) ? (roomId[0] ?? "") : (roomId ?? ""));
      }
    };
  }, [roomId]);
  return (
    <>
      <div className='flex-col relative justify-between p-4 overflow-y-auto space-y-3'>
        {messages?.map(
          (message: { msg: string; username: string }, index: number) => (
            <div
              key={index}
              className={`max-w-1/3  flex-wrap flex flex-col px-4 py-1 rounded-2xl ${
                message.username == "me"
                  ? "bg-green-600 ml-auto text-right"
                  : "bg-gray-700 mr-auto"
              }`}
            >
              <p className='text-blue-600 text-xs'>{message.username}</p>
              <p className='text-wrap'>{message.msg}</p>
            </div>
          )
        )}
      </div>
      <div className='p-4 border-t w-full border-gray-700 flex gap-2 fixed bottom-0 bg-gray-800 '>
        <input
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
          type='text'
          className='flex-1 px-4 py-2 rounded-md'
          placeholder='Type your message...'
        />
        <button
          className='bg-green-600 px-4 py-2 rounded-md hover:bg-green-700'
          onClick={() => {
            if (sendMessage) {
              const normalizedRoomId = Array.isArray(roomId)
                ? (roomId[0] ?? "")
                : (roomId ?? "");
              sendMessage(text, normalizedRoomId);
              setText("");
            }
          }}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default ChatMessages;
