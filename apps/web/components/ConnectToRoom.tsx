"use client";
import React, { useState, useContext } from "react";
import { SocketContext } from "../context/SocketProvider";
export default function ConnectToRoom() {
  const [roomId, setRoomId] = useState<string>();

  const { connectMessage } = useContext(SocketContext)!;
  return (
    <div>
      <div className='flex gap-2'>
        <input
          type='text'
          placeholder='Room Name'
          className='text-white px-6 py-4 rounded-lg border-[1px]'
          value={roomId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRoomId(e.target.value)
          }
        />
        <button
          className='bg-green-700 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition'
          onClick={() => {
            if (roomId) connectMessage("join-room", { roomId: roomId });
          }}
        >
          Create New Room
        </button>
      </div>
      <button
        className='bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition'
        onClick={() => {
          connectMessage("join-room-random");
        }}
      >
        Create A Random Room
      </button>
    </div>
  );
}
