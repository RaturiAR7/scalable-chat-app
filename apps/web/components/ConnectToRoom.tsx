"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Users } from "lucide-react";

export default function ConnectToRoom() {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();

  return (
    <div className='grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8'>
      {/* Create Room Card */}
      <div className='group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl'>
        <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
          <Users className='w-8 h-8 text-white' />
        </div>
        <h3 className='text-xl font-semibold text-white mb-4'>
          Create Private Room
        </h3>
        <div className='space-y-4'>
          <input
            type='text'
            placeholder='Enter room name...'
            value={roomId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRoomId(e.target.value)
            }
            className='w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300'
          />
          <button
            onClick={() => {
              router.push(`/connect/${roomId}`);
            }}
            className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Create New Room
          </button>
        </div>
      </div>

      {/* Global Chat Card */}
      <div className='group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl'>
        <div className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
          <Globe className='w-8 h-8 text-white' />
        </div>
        <h3 className='text-xl font-semibold text-white mb-4'>
          Join Global Chat
        </h3>
        <p className='text-gray-300 mb-6 text-sm'>
          Connect with people from around the world in our main chat room
        </p>
        <button
          onClick={() => {
            router.push(`/connect/global`);
          }}
          className='w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105'
        >
          Chat Globally
        </button>
      </div>
    </div>
  );
}
