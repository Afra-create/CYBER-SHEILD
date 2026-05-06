import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100), // Wave starts
      setTimeout(() => setPhase(2), 800), // Icons flip to safe
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      {/* The expanding blue wave */}
      {phase >= 1 && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-blue-400"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: '200vw', height: '200vw', opacity: 0, borderWidth: '0px' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}

      {/* Safe Icons that replace the warnings */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Safe Icon 1 */}
        <motion.div 
          className="absolute top-[40%] left-[30%] flex flex-col items-center"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={phase >= 2 ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="p-3 rounded-full bg-blue-900/40 border border-blue-400/50 icon-glow-blue">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-500/30 backdrop-blur-md">
            <span className="text-blue-300 text-xs font-mono font-bold tracking-wider">SECURE</span>
          </div>
        </motion.div>

        {/* Safe Icon 2 */}
        <motion.div 
          className="absolute top-[35%] left-[55%] flex flex-col items-center"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={phase >= 2 ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
        >
          <div className="p-3 rounded-full bg-blue-900/40 border border-blue-400/50 icon-glow-blue">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-500/30 backdrop-blur-md">
            <span className="text-blue-300 text-xs font-mono font-bold tracking-wider">VERIFIED</span>
          </div>
        </motion.div>

        {/* Safe Icon 3 */}
        <motion.div 
          className="absolute top-[45%] left-[75%] flex flex-col items-center"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={phase >= 2 ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <div className="p-3 rounded-full bg-blue-900/40 border border-blue-400/50 icon-glow-blue">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-500/30 backdrop-blur-md">
            <span className="text-blue-300 text-xs font-mono font-bold tracking-wider">PROTECTED</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
