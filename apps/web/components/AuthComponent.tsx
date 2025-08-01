"use client";
import Image from "next/image";
import { login, logout } from "../app/lib/actions/auth";
import type { Session } from "@auth/core/types";

const AuthComponent = ({ session }: { session: Session | null }) => {
  return (
    <div className='text-white '>
      {session ? (
        <div className='flex gap-4 w-full items-center'>
          <p>{session?.user?.name}</p>
          <Image
            className='rounded-full'
            src={session?.user?.image || ""}
            width={35}
            height={20}
            alt='image'
          />
          <button
            className='bg-green-700 px-4 py-2 rounded hover:bg-green-800 transition'
            onClick={() => logout()}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          className='bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition'
          onClick={() => login()}
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default AuthComponent;
