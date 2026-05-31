import { Globe, Lock, Zap, Sparkles } from "lucide-react";
import ConnectToRoom from "../components/ConnectToRoom";

export default function ChatGlobalLanding() {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Main Content */}
      <main className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6'>
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 transform  "translate-y-10 opacity-0"`}
        >
          {/* Hero Title */}
          <div className='mb-8'>
            <h2 className='text-4xl sm:text-5xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight tracking-tight'>
              Connect with the
              <span className='block text-indigo-400'>
                World Instantly
              </span>
            </h2>
            <p className='text-base sm:text-lg md:text-xl text-slate-300 mb-4 font-light max-w-2xl mx-auto'>
              Join global chat rooms or private spaces — real-time and fast.
            </p>
            <p className='text-sm sm:text-base md:text-lg text-slate-400'>
              Experience the future of communication.
            </p>
          </div>
          {/* Feature Pills */}
          <div className='flex flex-wrap justify-center gap-4 mb-12'>
            <div className='flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-2'>
              <Zap className='w-4 h-4 text-indigo-400' />
              <span className='text-slate-100 text-sm'>Lightning Fast</span>
            </div>
            <div className='flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-2'>
              <Globe className='w-4 h-4 text-indigo-400' />
              <span className='text-slate-100 text-sm'>Global Reach</span>
            </div>
          </div>
          <ConnectToRoom />
        </div>
      </main>
      {/* Footer */}
      <footer className='relative z-10 text-center py-8 text-gray-400 text-sm'>
        <div className='flex justify-center items-center space-x-2 mb-2'>
          <Sparkles className='w-4 h-4 text-yellow-400' />
          <span>Built with love for seamless communication</span>
          <Sparkles className='w-4 h-4 text-yellow-400' />
        </div>
        <p>&copy; 2025 Chat Global. All rights reserved.</p>
      </footer>
    </div>
  );
}
