"use client";
import React, { useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string, roomId?: string) => any;
  connect: (type: string, roomId?: string) => any;
  leaveRoom: (roomId: string) => any;
  messages: string[];
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket>();
  const [messages, setMessages] = React.useState<string[]>([]);

  const connect: ISocketContext["connect"] = useCallback(
    (type, roomId) => {
      console.log("Sending message with type", type, roomId);
      if (socket && roomId) {
        socket.emit(type, { roomId: roomId });
      }
    },
    [socket]
  );

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg, roomId) => {
      console.log("Sending message:", msg);
      if (socket && msg) {
        if (roomId !== "globally") {
          /////Room Based Message
          socket.emit("event:room-message", { message: msg, roomId: roomId });
        } else {
          /////Global Messages
          socket.emit("event:message", { message: msg });
        }
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    },
    [socket]
  );

  const leaveRoom: ISocketContext["leaveRoom"] = (roomId: string) => {
    if (socket) {
      socket.emit("leave-room", { roomId: roomId });
    }
  };
  const onMessageRec = useCallback((msg: string) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  }, []);
  const onDisconnect = useCallback(() => {
    console.log("Disconnected from server");
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    _socket.on("message-from-server", onMessageRec);
    _socket.on("disconnect", onDisconnect);

    setSocket(_socket);

    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec);
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
