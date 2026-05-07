import { useState } from "react";

export function useSplash() {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return { showSplash, handleSplashComplete };
}
