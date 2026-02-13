import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./aws-exports";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

// Configure Amplify synchronously before rendering
try {
  Amplify.configure(amplifyconfig);
} catch (error) {
  console.warn("[Amplify] Configuration warning:", error);
}

// Small delay to ensure Amplify is fully configured
// This prevents race conditions on initial render
const renderApp = () => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
};

// Use requestIdleCallback if available, otherwise setTimeout
if (typeof requestIdleCallback !== "undefined") {
  requestIdleCallback(renderApp, { timeout: 100 });
} else {
  setTimeout(renderApp, 0);
}
