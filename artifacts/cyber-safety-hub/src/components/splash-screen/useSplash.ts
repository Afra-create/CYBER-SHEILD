import { useState } from "react";

export function useSplash() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem("splashShown");
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  return { showSplash, handleSplashComplete };
}
