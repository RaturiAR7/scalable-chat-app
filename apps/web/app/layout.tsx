import type { Metadata } from "next";
import "./globals.css";
import { SocketProvider } from "../context/SocketProvider";
import Navbar from "../components/Navbar";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Scalable Chat App",
  description: "Chat in real-time globally or in private rooms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <SessionProvider>
        <SocketProvider>
          <body>
            <Navbar />
            {children}
          </body>
        </SocketProvider>
      </SessionProvider>
    </html>
  );
}
