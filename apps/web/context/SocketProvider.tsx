"use client";
import React, { useCallback, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  connect: (type: string, roomId?: string) => any;
  leaveRoom: (roomId: string) => any;
  messages: string[];
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

////Custom Hook
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};
let router;
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket>();
  router = useRouter();
  const [messages, setMessages] = React.useState<string[]>([]);
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("Sending message:", msg);
      if (socket && msg) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );
  const connect: ISocketContext["connect"] = useCallback(
    (type, roomId) => {
      console.log("Sending messagewith type", type, roomId);
      if (socket && roomId) {
        socket.emit(type, { roomId: roomId });
        router.push(`/connect/${roomId}`);
      }
    },
    [socket]
  );

  const leaveRoom: ISocketContext["leaveRoom"] = (roomId: string) => {
    if (socket) {
      socket.emit("leave-room", { roomId: roomId });
      router.push(`/`);
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
