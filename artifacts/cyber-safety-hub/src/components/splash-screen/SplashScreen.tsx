import { useEffect, useState, useRef } from "react";
import "./SplashScreen.css";

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number; // ms, default 1500
}

export default function SplashScreen({ onComplete, duration = 1500 }: SplashScreenProps) {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked — still proceed with timing
      });
    }

    const fadeTimer = setTimeout(() => {
      setPhase("fading");
    }, duration);

    const removeTimer = setTimeout(() => {
      setPhase("gone");
      onComplete?.();
    }, duration + 300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onComplete]);

  if (phase === "gone") return null;

  return (
    <div className={`splash-overlay ${phase === "fading" ? "splash-fade-out" : ""}`}>
      <video
        ref={videoRef}
        className="splash-video"
        src="/splash-screen/logo.mp4"
        muted
        playsInline
        loop={false}
        preload="auto"
      />
    </div>
  );
}
