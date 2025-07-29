import React from "react";

const Navbar = () => {
  return (
    <nav className='w-full h-16 flex items-center px-5 justify-between'>
      <div className='font-bold text-2xl'>Chat Global</div>
      <div className='w-52 flex gap-3'>
        <button className='bg-[#3B82F6] text-white rounded-lg p-2 px-3'>
          Login
        </button>
        <button className='bg-[#22C55E] text-white rounded-lg p-2 px-3'>
          Guest House
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
