"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Users } from "lucide-react";

export default function ConnectToRoom() {
  const [roomId, setRoomId] = useState<string>("Global");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to poll the server until it responds
  const waitForServer = async (url: string, interval = 2000) => {
    return new Promise<void>((resolve) => {
      const check = async () => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            resolve(); // server is alive
          } else {
            setTimeout(check, interval);
          }
        } catch {
          setTimeout(check, interval);
        }
      };
      check();
    });
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    await waitForServer(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/health`);
    setLoading(false);
    router.push(`/connect/${roomId}`);
  };

  return (
    <div className='grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8'>
      {/* Create Room Card */}
      <div className='group bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/80 transition-colors duration-300'>
        <div className='flex items-center justify-center w-16 h-16 bg-slate-700 rounded-2xl mx-auto mb-4 group-hover:bg-slate-600 transition-colors duration-300'>
          <Users className='w-8 h-8 text-indigo-400' />
        </div>
        <h3 className='text-xl font-semibold text-slate-100 mb-4'>
          Create Private Room
        </h3>
        <div className='space-y-4'>
          <input
            type='text'
            placeholder='Enter room name...'
            // value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className='w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors duration-300'
          />
          <button
            onClick={handleCreateRoom}
            disabled={loading || roomId === "Global"}
            className='w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading && roomId !== "Global"
              ? "Starting Server. Please Wait..."
              : "Create New Room"}
          </button>
        </div>
      </div>

      {/* Global Chat Card */}
      <div className='group bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/80 transition-colors duration-300'>
        <div className='flex items-center justify-center w-16 h-16 bg-slate-700 rounded-2xl mx-auto mb-4 group-hover:bg-slate-600 transition-colors duration-300'>
          <Globe className='w-8 h-8 text-indigo-400' />
        </div>
        <h3 className='text-xl font-semibold text-slate-100 mb-4'>
          Join Global Chat
        </h3>
        <p className='text-slate-400 mb-6 text-sm font-light'>
          Connect with people from around the world in our main chat room
        </p>
        <button
          onClick={handleCreateRoom}
          className='w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300'
        >
          {loading && roomId === "Global"
            ? "Starting Server. Please Wait..."
            : "Chat Globally"}
        </button>
      </div>
    </div>
  );
}
