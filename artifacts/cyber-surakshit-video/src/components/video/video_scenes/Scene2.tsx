import { motion } from 'framer-motion';
import { ShieldAlert, PhoneOff, MessageSquareWarning } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400), // First warning
      setTimeout(() => setPhase(2), 1000), // Second warning
      setTimeout(() => setPhase(3), 1600), // Third warning
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }} // Fade out handled by next scene layering
    >
      {/* Red warning overlay glow for danger */}
      <motion.div 
        className="absolute inset-0 bg-red-900/5 mix-blend-color-burn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Warning Icons positioned over houses */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Phishing Warning (Left House) */}
        <motion.div 
          className="absolute top-[40%] left-[30%] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`p-3 rounded-full bg-[#020617]/80 border border-red-500/50 ${phase >= 1 ? 'glitch-effect icon-glow-red' : ''}`}>
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <motion.div 
            className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">PHISHING</span>
          </motion.div>
        </motion.div>

        {/* Scam Call (Center Right House) */}
        <motion.div 
          className="absolute top-[35%] left-[55%] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`p-3 rounded-full bg-[#020617]/80 border border-red-500/50 ${phase >= 2 ? 'glitch-effect icon-glow-red' : ''}`}>
            <PhoneOff className="w-8 h-8 text-red-500" />
          </div>
          <motion.div 
            className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.15, repeat: Infinity, delay: 0.1 }}
          >
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">SCAM_CALL</span>
          </motion.div>
        </motion.div>

        {/* Fake Message (Far Right House) */}
        <motion.div 
          className="absolute top-[45%] left-[75%] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`p-3 rounded-full bg-[#020617]/80 border border-red-500/50 ${phase >= 3 ? 'glitch-effect icon-glow-red' : ''}`}>
            <MessageSquareWarning className="w-8 h-8 text-red-500" />
          </div>
          <motion.div 
            className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.25, repeat: Infinity, delay: 0.2 }}
          >
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">FAKE_SMS</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
