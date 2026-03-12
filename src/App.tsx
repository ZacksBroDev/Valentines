import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards";
import { LoadingScreen } from "./components/LoadingScreen";

// Lazy-load pages so the public landing page bundle stays small
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PrivateApp = lazy(() => import("./pages/PrivateApp"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

const PageFallback = () => <LoadingScreen theme="blush" />;

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Private: requires Cognito authentication */}
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <PrivateApp />
                </RequireAuth>
              }
            />

            {/* Admin: requires Admins Cognito group */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              }
            />

            {/* Catch-all: redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
