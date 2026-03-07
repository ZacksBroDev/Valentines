// ============================================================
// LOGIN PAGE - Cognito sign-in for private app access
// ============================================================

import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { confirmSignIn } from "aws-amplify/auth";
import { Heart, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, isAuthenticated, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [challengeStep, setChallengeStep] = useState<
    "SIGN_IN" | "NEW_PASSWORD_REQUIRED"
  >("SIGN_IN");

  // Redirect destination after login
  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname ?? "/app";

  // If already authenticated, redirect (using Navigate, not navigate() during render)
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (challengeStep === "NEW_PASSWORD_REQUIRED") {
        // Complete the new password challenge
        const result = await confirmSignIn({ challengeResponse: newPassword });
        if (result.isSignedIn) {
          await refreshSession(); // Sync AuthContext state
          navigate(from, { replace: true });
        }
      } else {
        const result = await login(email, password);

        if (result.isSignedIn) {
          navigate(from, { replace: true });
        } else if (
          result.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
        ) {
          setChallengeStep("NEW_PASSWORD_REQUIRED");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sign in failed. Check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex flex-col items-center justify-center p-6">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 text-pink-500 fill-pink-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to your Compliment Deck
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 space-y-4"
        >
          {challengeStep === "SIGN_IN" ? (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                You need to set a new password on first login.
              </p>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg p-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl py-2.5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {challengeStep === "NEW_PASSWORD_REQUIRED"
              ? "Set Password"
              : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          This app is private. Only invited users can sign in.
        </p>
      </div>
    </div>
  );
}
