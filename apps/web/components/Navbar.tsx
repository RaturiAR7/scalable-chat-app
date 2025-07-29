import React from "react";

const Navbar = () => {
  return (
    <nav className='w-full h-16 bg-gray-800 shadow flex items-center justify-between px-6'>
      <div className='text-2xl font-bold text-green-400'>Chat Global</div>
      <div className='space-x-4'>
        <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition'>
          Login
        </button>
        <button className='bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition'>
          Guest Access
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
