export default function Page() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-900 text-white'>
      {/* Hero Section */}
      <div className='flex flex-col items-center justify-center flex-1 text-center px-4'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
          Connect with the World Instantly
        </h1>
        <p className='text-gray-300 text-lg mb-6 max-w-xl'>
          Join global chat rooms or private spaces — real-time, fast, and
          secure. Experience the future of communication.
        </p>
        <button className='bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition'>
          Create New Room
        </button>
      </div>

      {/* Footer */}
      <footer className='bg-gray-800 w-full py-4 text-center text-gray-400 shadow-inner'>
        © 2025 Chat Global. All rights reserved.
      </footer>
    </div>
  );
}
