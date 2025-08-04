"use client";
import Image from "next/image";
import { login, logout } from "../app/lib/actions/auth";
import type { Session } from "@auth/core/types";

const AuthComponent = ({ session }: { session: Session | null }) => {
  return (
    <div className='text-white '>
      {session ? (
        <div className='flex md:gap-4 sm:gap-2 gap-1 w-full items-center'>
          <p className='text-xs sm:text-base md:text-lg'>
            {session?.user?.name}
          </p>
          <Image
            className='rounded-full md:w-10 md:h-10 w-7 h-7'
            src={session?.user?.image || ""}
            width={35}
            height={20}
            alt='image'
          />
          <button
            className='bg-green-700 md:px-4 md:py-2 px-2 py-1 text-base rounded hover:bg-green-800 transition'
            onClick={() => logout()}
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          className='bg-green-500 md:px-4 md:py-2 px-2 py-1 rounded hover:bg-green-600 transition'
          onClick={() => login()}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default AuthComponent;
