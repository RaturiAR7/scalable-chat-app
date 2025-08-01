"use client";
import React, { useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}
interface message {
  msg: string;
  username: string;
}
interface ISocketContext {
  sendMessage: (msg: string, roomId?: string) => void;
  connect: (type: string, roomId: string, username: string) => void;
  leaveRoom: (roomId: string) => void;
  messages: message[];
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket>();
  const [messages, setMessages] = React.useState<
    {
      msg: string;
      username: string;
    }[]
  >([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg, roomId) => {
      if (socket && msg) {
        socket.emit("event:room-message", { message: msg, roomId: roomId });
        setMessages((prevMessages) => [
          ...prevMessages,
          { msg, username: "me" },
        ]);
      }
    },
    [socket]
  );

  const leaveRoom: ISocketContext["leaveRoom"] = (roomId: string) => {
    if (socket) {
      socket.emit("leave-room", { roomId: roomId });
    }
  };
  const onMessageRec = useCallback((msg: string, username: string) => {
    setMessages((prevMessages) => [...prevMessages, { msg, username }]);
  }, []);
  const onDisconnect = useCallback(() => {
    console.log("Disconnected from server");
  }, []);

  const connect: ISocketContext["connect"] = useCallback(
    (type, roomId, username) => {
      if (socket) {
        socket.disconnect(); // disconnect the previous socket
      }
      console.log(
        "Connecting to socket server...",
        process.env.NEXT_PUBLIC_BACKEND_URL
      );
      const _socket = io(
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
        {
          reconnection: !socket ? true : false,
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
          query: { username },
        }
      );

      _socket.on("message-from-server", onMessageRec);
      _socket.on("disconnect", onDisconnect);

      if (roomId) {
        _socket.emit(type, { roomId });
      }

      setSocket(_socket); // this will be available on next render
    },
    [onMessageRec, onDisconnect, socket]
  );

  useEffect(() => {
    return () => {
      socket?.disconnect();
      socket?.off("message-from-server", onMessageRec); // Corrected event name
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ sendMessage, connect, messages, leaveRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
};
