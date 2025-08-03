"use client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SocketContext } from "../context/SocketProvider";
import { UserInfo, message } from "../app/constants/types";
import { generateGuestUser } from "../app/lib/generator";

const ChatMessages = () => {
  const socketContext = useContext(SocketContext);
  const messages = socketContext?.messages;
  const sendMessage = socketContext?.sendMessage;
  const leaveRoom = socketContext?.leaveRoom;
  const connect = socketContext?.connect;
  const { roomId } = useParams();
  const [text, setText] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserInfo | null>(null);
  const session = useSession();

  useEffect(() => {
    if (!roomId || !connect) return;

    let userInfo: UserInfo;

    if (session.status === "authenticated" && session.data?.user) {
      userInfo = {
        name: session.data.user.name ?? "",
        email: session.data.user.email ?? "",
        image: session.data.user.image ?? "",
        id: session.data.user.id ?? "",
      };
    } else {
      userInfo = generateGuestUser();
    }

    setUserDetails(userInfo);
    connect(
      "join-room",
      Array.isArray(roomId) ? (roomId[0] ?? "") : (roomId ?? ""),
      userInfo
    );

    return () => {
      if (leaveRoom && roomId) {
        leaveRoom(Array.isArray(roomId) ? (roomId[0] ?? "") : (roomId ?? ""));
      }
    };
  }, [roomId, session]);

  return (
    <>
      <div className='flex-col relative justify-between p-4 overflow-y-auto space-y-3'>
        {messages?.map((message: message, index: number) => (
          <div
            key={index}
            className={`max-w-1/3  flex-wrap flex flex-col px-4 py-1 rounded-2xl ${
              message?.userInfo?.name === userDetails?.name &&
              message?.userInfo?.email === userDetails?.email
                ? "bg-green-600 ml-auto text-right"
                : "bg-gray-700 mr-auto"
            }`}
          >
            <p className='text-blue-600 text-xs'>{message?.userInfo?.name}</p>
            <p className='text-wrap'>{message.msg}</p>
          </div>
        ))}
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
              if (sendMessage && userDetails)
                sendMessage(text, normalizedRoomId, userDetails);
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
