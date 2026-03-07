// ============================================================
// PRIVATE APP - The authenticated compliment deck experience
// This is the original App content, now behind auth
// ============================================================

import { useState, useEffect } from "react";
import { HeartTrail } from "../components/HeartTrail";
import { MainContentV2 } from "../components/MainContentV2";
import { LoadingScreen } from "../components/LoadingScreen";
import { IntroScreen } from "../components/IntroScreen";
import { CardProvider } from "../context/CardContext";
import { useAppState } from "../hooks/useAppState";
import { syncServerTime } from "../api/client";
import { hasSeenIntro, setHasSeenIntro } from "../utils/storage";

function PrivateAppInner() {
  const [heartTrailEnabled, setHeartTrailEnabled] = useState(false);
  const [showIntro, setShowIntro] = useState(!hasSeenIntro());

  useEffect(() => {
    syncServerTime();
  }, []);

  const state = useAppState({
    heartTrailEnabled,
    setHeartTrailEnabled,
  });

  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    setShowIntro(false);
  };

  if (state.isLoading) {
    return <LoadingScreen theme={state.currentTheme} />;
  }

  if (showIntro) {
    return <IntroScreen isOpen={showIntro} onComplete={handleIntroComplete} />;
  }

  return (
    <>
      <HeartTrail enabled={heartTrailEnabled} />
      <MainContentV2 state={state} />
    </>
  );
}

export default function PrivateApp() {
  return (
    <CardProvider>
      <PrivateAppInner />
    </CardProvider>
  );
}
