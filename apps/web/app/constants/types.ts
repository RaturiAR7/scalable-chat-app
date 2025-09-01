export interface UserInfo {
  name: string | undefined;
  email: string | undefined;
  image?: string | undefined;
  id?: string | undefined;
}
export interface message {
  msg: string;
  userInfo: UserInfo;
  isOwn: boolean;
  date: Date;
}
export interface ISocketContext {
  sendMessage: (msg: string, roomId: string, userInfo: UserInfo) => void;
  connect: (type: string, roomId: string, userInfo: UserInfo) => void;
  leaveRoom: (roomId: string) => void;
  messages: message[];
}
export interface SocketProviderProps {
  children?: React.ReactNode;
}

export interface previousMessageDataType {
  text: string;
  sender: {
    name: string;
    email: string;
    image: string;
    id: string;
  };
  isOwn: boolean;
  createdAt: string;
}
