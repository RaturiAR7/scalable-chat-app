"use client";
import React, { useCallback, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  connectMessage: (type: string, roomId?: string) => any;
  messages: string[];
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

////Custom Hook
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket>();
  const [messages, setMessages] = React.useState<string[]>([]);
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("Sending message:", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );
  const connectMessage: ISocketContext["connectMessage"] = useCallback(
    (type, roomId) => {
      console.log("Sending messagewith type", type);
      if (socket) {
        socket.emit(type, roomId);
      }
    },
    [socket]
  );
  const onMessageRec = useCallback((msg: string) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message-from-server", onMessageRec);

    setSocket(_socket);

    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec);
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, connectMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
