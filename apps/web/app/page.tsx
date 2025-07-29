"use client";
import { useSocket } from "../context/SocketProvider";
import React, { useState } from "react";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  console.log(messages);
  const [message, setMessage] = useState("");
  return (
    <div className='bg-black'>
      <div>
        <h1 style={{ color: "white", fontSize: "bold" }}>
          All Messages Will Appear Here
        </h1>
        <div>
          {message.length > 0 &&
            messages.map((message: string, index: number) => (
              <h1 key={index}>{message}</h1>
            ))}
        </div>
      </div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          type='text'
          placeholder='Message'
        />
        <button onClick={(e) => sendMessage(message)}>Send</button>
      </div>
    </div>
  );
}
