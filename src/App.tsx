import { useState, useEffect } from "react";
import { HeartTrail } from "./components/HeartTrail";
import { MainContentV2 } from "./components/MainContentV2";
import { LoadingScreen } from "./components/LoadingScreen";
import { IntroScreen } from "./components/IntroScreen";
import { ToastProvider } from "./context/ToastContext";
import { useAppState } from "./hooks/useAppState";
import { syncServerTime } from "./api/client";
import { hasSeenIntro, setHasSeenIntro } from "./utils/storage";

/**
 * App content wrapper that manages the heart trail state
 * and initializes the main application state
 */
const AppContent = () => {
  const [heartTrailEnabled, setHeartTrailEnabled] = useState(false);
  const [showIntro, setShowIntro] = useState(!hasSeenIntro());

  // Sync server time on mount for timezone hardening
  useEffect(() => {
    syncServerTime();
  }, []);

  const state = useAppState({
    heartTrailEnabled,
    setHeartTrailEnabled,
  });

  // Handle intro completion
  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    setShowIntro(false);
  };

  if (state.isLoading) {
    return <LoadingScreen theme={state.currentTheme} />;
  }

  // Show intro screen for first-time users
  if (showIntro) {
    return <IntroScreen isOpen={showIntro} onComplete={handleIntroComplete} />;
  }

  return (
    <>
      <HeartTrail enabled={heartTrailEnabled} />
      <MainContentV2 state={state} />
    </>
  );
};

/**
 * Root App component
 * Wraps the application in necessary providers
 */
function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
