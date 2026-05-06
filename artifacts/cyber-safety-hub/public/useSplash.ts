// useSplash.ts
// Controls whether the splash screen has been shown this session.
// After the first visit, the splash won't show again until the tab is closed.

import { useState } from "react";

export function useSplash() {
  // Show splash only once per session
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem("splashShown");
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  return { showSplash, handleSplashComplete };
}
