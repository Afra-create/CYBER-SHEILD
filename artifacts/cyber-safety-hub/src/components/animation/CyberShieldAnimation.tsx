import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, PhoneOff, MessageSquareWarning, ShieldCheck } from 'lucide-react';

// --- Types & Constants ---

const SCENE_DURATIONS: Record<string, number> = {
  open: 2400,
  danger: 2900,
  tension: 1000,
  shield: 3400,
  resolve: 3500,
};

// --- Scenes ---

function Scene1() {
  return (
    <motion.div 
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
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
      <motion.div 
        className="absolute inset-0 bg-red-900/5 mix-blend-color-burn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-[40%] left-[30%] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`p-3 rounded-full bg-[#020617]/80 border border-red-500/50 ${phase >= 1 ? 'animate-pulse' : ''}`}>
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <motion.div className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md">
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">PHISHING</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute top-[35%] left-[55%] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`p-3 rounded-full bg-[#020617]/80 border border-red-500/50 ${phase >= 2 ? 'animate-pulse' : ''}`}>
            <PhoneOff className="w-8 h-8 text-red-500" />
          </div>
          <motion.div className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md">
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">SCAM_CALL</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute top-[45%] left-[75%] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`p-3 rounded-full bg-[#020617]/80 border border-red-500/50 ${phase >= 3 ? 'animate-pulse' : ''}`}>
            <MessageSquareWarning className="w-8 h-8 text-red-500" />
          </div>
          <motion.div className="mt-2 px-3 py-1 rounded bg-red-500/20 border border-red-500/30 backdrop-blur-md">
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider">FAKE_SMS</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Scene3() {
  return (
    <motion.div 
      className="absolute inset-0"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-red-900/5 mix-blend-color-burn" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[40%] left-[30%] flex flex-col items-center">
          <div className="p-3 rounded-full bg-[#020617]/80 border border-red-500/50 animate-pulse">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="absolute top-[35%] left-[55%] flex flex-col items-center">
          <div className="p-3 rounded-full bg-[#020617]/80 border border-red-500/50 animate-pulse">
            <PhoneOff className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="absolute top-[45%] left-[75%] flex flex-col items-center">
          <div className="p-3 rounded-full bg-[#020617]/80 border border-red-500/50 animate-pulse">
            <MessageSquareWarning className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 800),
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
      {phase >= 1 && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-blue-400"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: '200vw', height: '200vw', opacity: 0, borderWidth: '0px' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      )}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-[40%] left-[30%] flex flex-col items-center"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={phase >= 2 ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="p-3 rounded-full bg-blue-900/40 border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-500/30 backdrop-blur-md">
            <span className="text-blue-300 text-xs font-mono font-bold tracking-wider">SECURE</span>
          </div>
        </motion.div>

        <motion.div 
          className="absolute top-[35%] left-[55%] flex flex-col items-center"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={phase >= 2 ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
        >
          <div className="p-3 rounded-full bg-blue-900/40 border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-blue-500/20 border border-blue-500/30 backdrop-blur-md">
            <span className="text-blue-300 text-xs font-mono font-bold tracking-wider">VERIFIED</span>
          </div>
        </motion.div>

        <motion.div 
          className="absolute top-[45%] left-[75%] flex flex-col items-center"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={phase >= 2 ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: 90 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <div className="p-3 rounded-full bg-blue-900/40 border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
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

function Scene5() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center z-50">
        <motion.h1 
          className="text-[6vw] font-black tracking-tight text-white leading-tight font-display"
          initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ textShadow: '0 0 30px rgba(59,130,246,0.5)' }}
        >
          Har Ghar
          <br />
          <span className="text-blue-400">Cyber Surakshit</span>
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-[2vw] text-blue-200/80 font-medium tracking-wide uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Every Home Digitally Safe
        </motion.p>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-10px`,
            }}
            animate={{
              y: [0, -1000],
              x: [0, (Math.random() - 0.5) * 200],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  open: Scene1,
  danger: Scene2,
  tension: Scene3,
  shield: Scene4,
  resolve: Scene5,
};

// --- Main Animation Component ---

export function CyberShieldAnimation() {
  const sceneKeys = Object.keys(SCENE_DURATIONS);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const currentDuration = SCENE_DURATIONS[sceneKeys[currentScene]];
    const timer = setTimeout(() => {
      setCurrentScene(prev => (prev + 1) % sceneKeys.length);
    }, currentDuration);
    return () => clearTimeout(timer);
  }, [currentScene, sceneKeys]);

  const currentSceneKey = sceneKeys[currentScene];
  const SceneComponent = SCENE_COMPONENTS[currentSceneKey];

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#020617]">
      {/* Persistent Background Layer */}
      <motion.div
        className="absolute inset-0 transition-colors duration-[2000ms]"
        animate={{
          background: currentScene >= 3
            ? 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
            : 'radial-gradient(circle at center, #020617 0%, #000000 100%)'
        }}
      />

      {/* Dynamic light pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full blur-[100px] pointer-events-none"
        animate={{
          background: currentScene >= 3 ? 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' : 'transparent',
          scale: currentScene >= 3 ? [0.8, 1.1, 1] : 0,
          opacity: currentScene >= 3 ? 1 : 0
        }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* The Neighborhood Image Layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: currentScene >= 3 ? 1.02 : 1,
        }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <img
          src="/neighborhood.png"
          alt="Neighborhood"
          className="w-[80vw] max-w-[1200px] object-contain opacity-70"
          style={{
            filter: currentScene >= 3
              ? 'drop-shadow(0 0 30px rgba(59,130,246,0.2)) brightness(1.2)'
              : 'brightness(0.7)'
          }}
        />
      </motion.div>

      {/* Global Shield overlay */}
      <motion.div
        className="absolute inset-x-[10vw] bottom-0 top-[20vh] rounded-t-full border-t-2 border-[#3b82f6]/30 bg-gradient-to-t from-[#3b82f6]/10 to-transparent pointer-events-none backdrop-blur-[2px]"
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{
          opacity: currentScene >= 3 ? 1 : 0,
          scale: currentScene >= 3 ? 1 : 0.8,
          y: currentScene >= 3 ? 0 : 100
        }}
        transition={{ duration: 1.5, ease: "easeOut", delay: currentScene === 3 ? 0.5 : 0 }}
      />

      <AnimatePresence mode="wait">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
