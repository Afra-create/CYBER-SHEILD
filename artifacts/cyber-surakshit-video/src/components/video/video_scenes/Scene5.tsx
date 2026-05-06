import { motion } from 'framer-motion';

export function Scene5() {
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
          className="text-[6vw] font-black tracking-tight text-white leading-tight font-display text-glow"
          initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
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

      {/* Ambient floating safe particles */}
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
