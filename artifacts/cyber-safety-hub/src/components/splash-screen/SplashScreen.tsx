import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

interface SplashScreenProps {
  duration?: number;
  onComplete: () => void;
}

export default function SplashScreen({ duration = 1500, onComplete }: SplashScreenProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="bg-primary/20 p-6 rounded-full animate-pulse mb-6">
        <Shield className="w-16 h-16 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">CyberAngel</h1>
      <p className="text-muted-foreground animate-pulse">Initializing defense systems...</p>
    </div>
  );
}
