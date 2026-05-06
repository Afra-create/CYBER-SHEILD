import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { ModernNeighborhood } from './ModernNeighborhood';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

export const SCENE_DURATIONS: Record<string, number> = {
  open: 2500,
  danger: 3000,
  tension: 1000,
  shield: 3500,
  resolve: 3500,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  open: Scene1,
  danger: Scene2,
  tension: Scene3,
  shield: Scene4,
  resolve: Scene5,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#020617' }}>

      {/* Sky gradient — shifts cooler/bluer during shield scene */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: sceneIndex >= 3
            ? 'radial-gradient(ellipse 120% 60% at 50% 0%, #0a1628 0%, #020617 60%)'
            : 'radial-gradient(ellipse 120% 50% at 50% 0%, #050d1a 0%, #000000 70%)',
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Stars — visible in opening scenes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: sceneIndex >= 3 ? 0.2 : 0.6 }}
        transition={{ duration: 2 }}
      >
        {[
          [12,8],[18,22],[35,5],[42,18],[58,9],[67,3],[75,14],[88,7],[94,20],
          [5,40],[22,33],[38,45],[50,28],[63,38],[79,31],[91,42],[15,55],[45,50],
          [70,48],[85,55],[30,60],[55,65],[25,15],[80,25],[48,35],[10,30],
        ].map(([cx, cy], i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${cx}%`, top: `${cy}%`, width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1 }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </motion.div>

      {/* Ambient blue pulse during shield/resolve */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full blur-[80px] pointer-events-none"
        animate={{
          background: sceneIndex >= 3 ? 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)' : 'transparent',
          opacity: sceneIndex >= 3 ? 1 : 0,
          scale: sceneIndex >= 3 ? [0.9, 1.05, 0.9] : 0,
        }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: sceneIndex >= 3 ? Infinity : 0 }}
      />

      {/* Modern city skyline — replaces neighborhood.png */}
      <ModernNeighborhood sceneIndex={sceneIndex} />

      {/* Shield dome overlay — scene 4+ */}
      <motion.div
        className="absolute inset-x-[5vw] bottom-0 top-[25vh] rounded-t-[50%] border-t border-[#3b82f6]/25 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
        initial={{ opacity: 0, y: 60, scaleX: 0.8 }}
        animate={{
          opacity: sceneIndex >= 3 ? 1 : 0,
          y: sceneIndex >= 3 ? 0 : 60,
          scaleX: sceneIndex >= 3 ? 1 : 0.8,
        }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: sceneIndex === 3 ? 0.4 : 0 }}
      />

      {/* Per-scene overlays */}
      <AnimatePresence mode="sync">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
