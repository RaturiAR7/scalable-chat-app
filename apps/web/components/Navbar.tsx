import React from "react";
import { auth } from "../auth";
import AuthComponent from "./AuthComponent";
import type { Session } from "@auth/core/types";
import { MessageCircle } from "lucide-react";

const Navbar = async () => {
  const session: Session | null = await auth();

  return (
    <nav className='relative z-10 flex justify-between items-center md:p-6 p-4'>
      <div className='flex items-center space-x-3'>
        <div className='relative'>
          <MessageCircle className='md:w-8 md:h-8 w-6 h-6 text-emerald-400' />
          <div className='absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping'></div>
        </div>
        <h1 className='text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
          Chat Global
        </h1>
      </div>
      <AuthComponent session={session} />
    </nav>
  );
};

export default Navbar;
