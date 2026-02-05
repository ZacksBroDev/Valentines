import { useState } from "react";
import { HeartTrail } from "./components/HeartTrail";
import { MainContentV2 } from "./components/MainContentV2";
import { LoadingScreen } from "./components/LoadingScreen";
import { ToastProvider } from "./context/ToastContext";
import { useAppState } from "./hooks/useAppState";

/**
 * App content wrapper that manages the heart trail state
 * and initializes the main application state
 */
const AppContent = () => {
  const [heartTrailEnabled, setHeartTrailEnabled] = useState(false);

  const state = useAppState({
    heartTrailEnabled,
    setHeartTrailEnabled,
  });

  if (state.isLoading) {
    return <LoadingScreen theme={state.currentTheme} />;
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
