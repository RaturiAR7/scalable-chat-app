"use client";
import { useContext, useEffect, useState } from "react";
import { SocketContext, UserInfo } from "../context/SocketProvider";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { message } from "../context/SocketProvider";
import { generateGuestUser } from "../app/lib/generator";

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
    if (roomId && connect) {
      let userInfo: UserInfo;
      if (session?.data !== null) {
        userInfo = {
          name: session.data.user?.name ?? "",
          email: session.data.user?.email ?? "",
          image: session.data.user?.image ?? "",
          id: session.data.user?.id ?? "",
        };
      } else {
        userInfo = generateGuestUser();
      }
      connect(
        "join-room",
        Array.isArray(roomId) ? (roomId[0] ?? "") : (roomId ?? ""),
        userInfo
      );
    }

    return () => {
      if (leaveRoom && roomId) {
        leaveRoom(Array.isArray(roomId) ? (roomId[0] ?? "") : (roomId ?? ""));
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      if (connect && roomId != undefined) {
        connect(
          "join-room",
          Array.isArray(roomId) ? (roomId[0] ?? "") : (roomId ?? ""),
          {
            name:
              session?.data?.user?.name ??
              `Guest${Math.floor(Math.random() * 1000)}`,
            email: session?.data?.user?.email ?? "guest.com",
            image: session?.data?.user?.image ?? "",
            id: session?.data?.user?.id ?? "guest-id",
          }
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
        {messages?.map((message: message, index: number) => (
          <div
            key={index}
            className={`max-w-1/3  flex-wrap flex flex-col px-4 py-1 rounded-2xl ${
              message?.userInfo?.name === "me"
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
              sendMessage(text, normalizedRoomId, {
                name: session?.data?.user?.name ?? "Guest",
                email: session?.data?.user?.email ?? "guest.com",
                image: session?.data?.user?.image ?? "",
                id: session?.data?.user?.id ?? "guest-id",
              });
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
