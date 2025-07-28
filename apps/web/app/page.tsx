"use client";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";
import React, { useState } from "react";
export default function Page() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <div>
      <div>
        <h1>All Messages Will Appear Here</h1>
      </div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className={classes["chat-input"]}
          type='text'
          placeholder='Message'
        />
        <button onClick={(e) => sendMessage(message)}>Send</button>
      </div>
    </div>
  );
}
