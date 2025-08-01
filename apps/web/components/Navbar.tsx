import React from "react";
import AuthenticationButtons from "./AuthComponent";
import { auth } from "../auth";
import AuthComponent from "./AuthComponent";
import type { Session } from "@auth/core/types";

const Navbar = async () => {
  const session: Session | null = await auth();

  return (
    <nav className='w-full h-16 bg-gray-800 shadow flex items-center justify-between px-6'>
      <div className='text-2xl font-bold text-green-400'>Chat Global</div>
      
      <AuthComponent session={session} />
    </nav>
  );
};

export default Navbar;
