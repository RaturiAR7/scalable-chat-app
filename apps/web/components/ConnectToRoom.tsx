"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectToRoom() {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();

  return (
    <div className=' flex flex-col gap-5'>
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
            router.push(`/connect/${roomId}`);
          }}
        >
          Create New Room
        </button>
      </div>
      <button
        className='bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition'
        onClick={() => {
          router.push(`/connect/global`);
        }}
      >
        Chat Globally
      </button>
    </div>
  );
}
