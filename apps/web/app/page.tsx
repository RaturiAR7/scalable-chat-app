import { Globe, Lock, Zap, Sparkles } from "lucide-react";
import ConnectToRoom from "../components/ConnectToRoom";

export default function ChatGlobalLanding() {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Main Content */}
      <main className='relative z-10 flex flex-col items-center justify-center min-h-screen px-6'>
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 transform  "translate-y-10 opacity-0"`}
        >
          {/* Hero Title */}
          <div className='mb-8'>
            <h2 className='text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6 leading-tight'>
              Connect with the
              <span className='block bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent'>
                World Instantly
              </span>
            </h2>
            <p className='text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed'>
              Join global chat rooms or private spaces — real-time, fast, and
              secure.
            </p>
            <p className='text-lg text-gray-400'>
              Experience the future of communication.
            </p>
          </div>
          {/* Feature Pills */}
          <div className='flex flex-wrap justify-center gap-4 mb-12'>
            <div className='flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2'>
              <Zap className='w-4 h-4 text-yellow-400' />
              <span className='text-white text-sm'>Lightning Fast</span>
            </div>
            <div className='flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2'>
              <Lock className='w-4 h-4 text-green-400' />
              <span className='text-white text-sm'>End-to-End Encrypted</span>
            </div>
            <div className='flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2'>
              <Globe className='w-4 h-4 text-blue-400' />
              <span className='text-white text-sm'>Global Reach</span>
            </div>
          </div>
          <ConnectToRoom />
          {/* Stats */}
          <div className='flex justify-center items-center space-x-8 text-center'>
            <div className='group'>
              <div className='text-3xl font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-300'>
                1M+
              </div>
              <div className='text-gray-400 text-sm'>Active Users</div>
            </div>
            <div className='w-px h-12 bg-gray-600'></div>
            <div className='group'>
              <div className='text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300'>
                50K+
              </div>
              <div className='text-gray-400 text-sm'>Chat Rooms</div>
            </div>
            <div className='w-px h-12 bg-gray-600'></div>
            <div className='group'>
              <div className='text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform duration-300'>
                99.9%
              </div>
              <div className='text-gray-400 text-sm'>Uptime</div>
            </div>
          </div>
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
