import { motion } from 'framer-motion';

interface BuildingProps {
  x: number;
  width: number;
  height: number;
  baseY?: number;
  color?: string;
  windowRows?: number;
  windowCols?: number;
  windowColor?: string;
  rooftopDetail?: 'antenna' | 'flat' | 'ac' | 'tower';
  delay?: number;
}

function Building({
  x, width, height, baseY = 440, color = '#111827',
  windowRows = 4, windowCols = 3,
  windowColor = 'rgba(255, 220, 120, 0.85)',
  rooftopDetail = 'flat', delay = 0,
}: BuildingProps) {
  const top = baseY - height;
  const wx = 10;
  const wy = 10;
  const wGapX = (width - wx * windowCols - 16) / (windowCols - 1 || 1) + wx;
  const wGapY = (height - wy * windowRows - 16) / (windowRows - 1 || 1) + wy;

  return (
    <motion.g
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Main body */}
      <rect x={x} y={top} width={width} height={height} fill={color} />
      {/* Top ridge line */}
      <rect x={x} y={top} width={width} height={2} fill="rgba(255,255,255,0.06)" />
      {/* Side shadow */}
      <rect x={x + width - 8} y={top} width={8} height={height} fill="rgba(0,0,0,0.25)" />

      {/* Windows grid */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowCols }).map((_, col) => {
          const lit = Math.random() > 0.28;
          const wx_ = x + 8 + col * wGapX;
          const wy_ = top + 14 + row * wGapY;
          return (
            <rect
              key={`${row}-${col}`}
              x={wx_} y={wy_} width={wx} height={wy}
              fill={lit ? windowColor : 'rgba(0,0,0,0.5)'}
              rx={1}
              style={{ filter: lit ? 'drop-shadow(0 0 3px rgba(255,200,80,0.5))' : undefined }}
            />
          );
        })
      )}

      {/* Rooftop details */}
      {rooftopDetail === 'antenna' && (
        <line x1={x + width / 2} y1={top} x2={x + width / 2} y2={top - 24}
          stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      )}
      {rooftopDetail === 'ac' && (
        <>
          <rect x={x + 8} y={top - 6} width={20} height={6} fill="rgba(255,255,255,0.08)" rx={1} />
          <rect x={x + width - 28} y={top - 6} width={20} height={6} fill="rgba(255,255,255,0.08)" rx={1} />
        </>
      )}
      {rooftopDetail === 'tower' && (
        <>
          <rect x={x + width / 2 - 4} y={top - 18} width={8} height={18} fill={color} />
          <rect x={x + width / 2 - 8} y={top - 18} width={16} height={4} fill="rgba(255,255,255,0.1)" />
          <circle cx={x + width / 2} cy={top - 22} r={3} fill="rgba(255,80,80,0.8)" />
        </>
      )}
    </motion.g>
  );
}

interface ModernNeighborhoodProps {
  sceneIndex: number;
}

export function ModernNeighborhood({ sceneIndex }: ModernNeighborhoodProps) {
  const shieldActive = sceneIndex >= 3;

  return (
    <motion.div
      className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden"
      animate={{
        filter: shieldActive
          ? 'drop-shadow(0 0 40px rgba(59,130,246,0.3)) brightness(1.15)'
          : 'brightness(0.88)',
      }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <svg
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMax meet"
        className="w-full max-w-[1400px]"
        style={{ overflow: 'visible' }}
      >
        {/* Ground */}
        <rect x={0} y={440} width={1200} height={60} fill="#0a0f1a" />
        <rect x={0} y={440} width={1200} height={2} fill="rgba(255,255,255,0.06)" />

        {/* Road markings */}
        <rect x={0} y={456} width={1200} height={1} fill="rgba(255,255,255,0.04)" />
        {[100, 250, 400, 550, 700, 850, 1000].map(rx => (
          <rect key={rx} x={rx} y={461} width={60} height={3} fill="rgba(255,255,255,0.07)" rx={1} />
        ))}

        {/* ── BACKGROUND buildings (darkest, furthest) ── */}
        <Building x={-10}  width={90}  height={160} color="#0b1220" windowRows={4} windowCols={2} delay={0.0} rooftopDetail="flat" />
        <Building x={200}  width={70}  height={200} color="#0c1525" windowRows={5} windowCols={2} delay={0.05} rooftopDetail="antenna" />
        <Building x={490}  width={60}  height={230} color="#0b1322" windowRows={6} windowCols={2} delay={0.1}  rooftopDetail="flat" />
        <Building x={750}  width={80}  height={180} color="#0c1424" windowRows={4} windowCols={2} delay={0.15} rooftopDetail="flat" />
        <Building x={1040} width={90}  height={210} color="#0a1120" windowRows={5} windowCols={2} delay={0.2}  rooftopDetail="antenna" />

        {/* ── MIDGROUND buildings ── */}
        {/* Far left residential block */}
        <Building x={0}    width={130} height={190} color="#111c2e" windowRows={5} windowCols={3} delay={0.1} rooftopDetail="ac" />
        {/* Left medium office */}
        <Building x={140}  width={110} height={270} color="#0e1929" windowRows={6} windowCols={3} delay={0.15} rooftopDetail="tower" />
        {/* Narrow tall */}
        <Building x={260}  width={75}  height={310} color="#101b2c" windowRows={8} windowCols={2} delay={0.2}  rooftopDetail="antenna" />
        {/* Wide center-left office */}
        <Building x={340}  width={190} height={235} color="#0f1a2b" windowRows={5} windowCols={5} delay={0.25} rooftopDetail="ac" />
        {/* Central skyscraper */}
        <Building x={535}  width={130} height={390} color="#0d1826" windowRows={10} windowCols={3} delay={0.3}  rooftopDetail="tower" />
        {/* Center-right glass tower */}
        <Building x={670}  width={150} height={300} color="#111e30" windowRows={7}  windowCols={4} delay={0.35} rooftopDetail="ac"
          windowColor="rgba(160, 220, 255, 0.7)"
        />
        {/* Right medium */}
        <Building x={830}  width={110} height={240} color="#0f1a2a" windowRows={6} windowCols={3} delay={0.4}  rooftopDetail="flat" />
        {/* Right tall */}
        <Building x={940}  width={130} height={320} color="#0d1827" windowRows={8} windowCols={3} delay={0.45} rooftopDetail="tower" />
        {/* Far right wide */}
        <Building x={1070} width={140} height={200} color="#111c2e" windowRows={5} windowCols={3} delay={0.5}  rooftopDetail="antenna" />

        {/* ── FOREGROUND buildings (tallest, closes) ── */}
        {/* Left foreground */}
        <Building x={-10}  width={145} height={220} color="#141f32" windowRows={5} windowCols={3} delay={0.2}  rooftopDetail="ac"
          windowColor="rgba(255, 240, 150, 0.9)"
        />
        {/* Centre-left foreground */}
        <Building x={158}  width={165} height={280} color="#131e30" windowRows={6} windowCols={4} delay={0.25} rooftopDetail="flat"
          windowColor="rgba(255, 220, 110, 0.85)"
        />
        {/* Centre foreground — glass facade */}
        <Building x={430}  width={175} height={260} color="#141f34" windowRows={5} windowCols={5} delay={0.3}  rooftopDetail="ac"
          windowColor="rgba(130, 200, 255, 0.75)"
        />
        {/* Centre-right */}
        <Building x={700}  width={180} height={240} color="#131e30" windowRows={5} windowCols={4} delay={0.35} rooftopDetail="flat" />
        {/* Right foreground */}
        <Building x={870}  width={145} height={210} color="#141f32" windowRows={5} windowCols={3} delay={0.4}  rooftopDetail="ac" />
        {/* Far right foreground */}
        <Building x={1050} width={160} height={235} color="#131e2e" windowRows={5} windowCols={4} delay={0.45} rooftopDetail="tower" />

        {/* Shield glow overlay when active */}
        {shieldActive && (
          <motion.rect
            x={0} y={0} width={1200} height={500}
            fill="rgba(59, 130, 246, 0.06)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </svg>
    </motion.div>
  );
}
