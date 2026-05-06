import { motion } from 'framer-motion';
import { ShieldAlert, PhoneOff, MessageSquareWarning } from 'lucide-react';

// Holds the tension from Scene 2 before the resolution.
// Keeps the warning icons visible and glitching.
export function Scene3() {
  return (
    <motion.div 
      className="absolute inset-0"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-red-900/5 mix-blend-color-burn" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[40%] left-[30%] flex flex-col items-center glitch-effect icon-glow-red">
          <div className="p-3 rounded-full bg-[#020617]/80 border border-red-500/50">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md opacity-80">
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">PHISHING</span>
          </div>
        </div>

        <div className="absolute top-[35%] left-[55%] flex flex-col items-center glitch-effect icon-glow-red" style={{ animationDelay: '0.1s' }}>
          <div className="p-3 rounded-full bg-[#020617]/80 border border-red-500/50">
            <PhoneOff className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md opacity-80">
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">SCAM_CALL</span>
          </div>
        </div>

        <div className="absolute top-[45%] left-[75%] flex flex-col items-center glitch-effect icon-glow-red" style={{ animationDelay: '0.2s' }}>
          <div className="p-3 rounded-full bg-[#020617]/80 border border-red-500/50">
            <MessageSquareWarning className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md opacity-80">
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">FAKE_SMS</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
