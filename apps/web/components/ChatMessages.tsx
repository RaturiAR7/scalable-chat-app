"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SocketContext } from "../context/SocketProvider";
import { UserInfo } from "../app/constants/types";
import { generateGuestUser } from "../app/lib/generator";
import { Paperclip, Send } from "lucide-react";
import avatar from "../public/user.png";

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
    <div className='h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col'>
      {/* Messages Container */}
      <div className='flex-1 relative z-10 overflow-hidden'>
        <div className='h-full overflow-y-auto px-6 py-4 space-y-4'>
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end space-x-2 max-w-xs md:max-w-md lg:max-w-lg`}
              >
                {!msg.isOwn && (
                  <div className='w-8 h-8 bg-gradient-to-r bg-black from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0'>
                    <Image
                      src={msg.userInfo.image || avatar}
                      height={100}
                      width={100}
                      className='rounded-full'
                      alt='User Avatar'
                    />
                  </div>
                )}

                <div
                  className={`group ${msg.isOwn ? "items-end" : "items-start"} flex flex-col`}
                >
                  {!msg.isOwn && (
                    <span className='text-xs text-gray-400 mb-1 px-3'>
                      {msg.userInfo.name}
                    </span>
                  )}

                  <div
                    className={`relative px-4 py-3 rounded-2xl transition-all duration-200 ${
                      msg.isOwn
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-br-md"
                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-bl-md"
                    } group-hover:shadow-lg group-hover:scale-105`}
                  >
                    <p className='text-sm leading-relaxed'>{msg.msg}</p>

                    <div
                      className={`flex items-center justify-end space-x-1 mt-1 ${msg.isOwn ? "text-white/70" : "text-gray-400"}`}
                    >
                      {/* <span className='text-xs'>{msg.time}</span> */}
                      {/* {msg.isOwn && getStatusIcon(msg.status)} */}
                    </div>
                  </div>
                </div>

                {msg.isOwn && (
                  <div className='w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0'>
                    <Image
                      src={msg.userInfo.image || avatar}
                      height={100}
                      width={100}
                      className='rounded-full'
                      alt='User Avatar'
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className='relative z-10 bg-white/10 backdrop-blur-lg border-t border-white/20 p-6'>
        <div className='flex items-end space-x-4'>
          <button className='p-3 hover:bg-white/10 rounded-full transition-colors flex-shrink-0'>
            <Paperclip className='w-5 h-5 text-gray-300' />
          </button>

          <div className='flex-1 relative'>
            <div className='bg-white/10 border border-white/30 rounded-2xl overflow-hidden'>
              <textarea
                onChange={(e) => {
                  setText(e.target.value);
                }}
                value={text}
                placeholder='Type your message...'
                className='w-full bg-transparent px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none max-h-32 min-h-[3rem]'
                style={{
                  height: "auto",
                  minHeight: "3rem",
                }}
              />
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <button
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
              className='p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex-shrink-0'
            >
              <Send className='w-5 h-5 text-white' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
