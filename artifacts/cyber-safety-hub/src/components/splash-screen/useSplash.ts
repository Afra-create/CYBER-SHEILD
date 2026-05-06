import { useState, useEffect } from 'react';

export function useSplash() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return {
    showSplash,
    handleSplashComplete
  };
}
