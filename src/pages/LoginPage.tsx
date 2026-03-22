// ============================================================
// LOGIN PAGE - Cognito sign-in for private app access
// ============================================================

import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { confirmSignIn } from "aws-amplify/auth";
import { Heart, ArrowLeft, Loader2 } from "lucide-react";

const LOGIN_GUARD_KEY = "valentine-login-guard";

interface LoginGuardState {
  failures: number;
  lockUntil: number;
}

const readLoginGuardState = (): LoginGuardState => {
  if (typeof window === "undefined") {
    return { failures: 0, lockUntil: 0 };
  }

  try {
    const raw = localStorage.getItem(LOGIN_GUARD_KEY);
    if (!raw) return { failures: 0, lockUntil: 0 };

    const parsed = JSON.parse(raw) as Partial<LoginGuardState>;
    return {
      failures: typeof parsed.failures === "number" ? parsed.failures : 0,
      lockUntil: typeof parsed.lockUntil === "number" ? parsed.lockUntil : 0,
    };
  } catch {
    return { failures: 0, lockUntil: 0 };
  }
};

const writeLoginGuardState = (state: LoginGuardState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOGIN_GUARD_KEY, JSON.stringify(state));
};

const clearLoginGuardState = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOGIN_GUARD_KEY);
};

const getCooldownMs = (failures: number): number => {
  if (failures >= 7) return 15 * 60 * 1000;
  if (failures >= 5) return 5 * 60 * 1000;
  if (failures >= 3) return 30 * 1000;
  return 0;
};

const getRemainingLockMs = (): number =>
  Math.max(0, readLoginGuardState().lockUntil - Date.now());

const formatCooldown = (ms: number): string => {
  const totalSeconds = Math.max(1, Math.ceil(ms / 1000));
  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
  return `${totalSeconds}s`;
};

const recordFailedLogin = (): number => {
  const current = readLoginGuardState();
  const failures = current.failures + 1;
  const cooldownMs = getCooldownMs(failures);
  const lockUntil = cooldownMs > 0 ? Date.now() + cooldownMs : 0;
  writeLoginGuardState({ failures, lockUntil });
  return lockUntil;
};

export default function LoginPage() {
  const { login, isAuthenticated, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockRemainingMs, setLockRemainingMs] = useState(getRemainingLockMs);
  const [challengeStep, setChallengeStep] = useState<
    "SIGN_IN" | "NEW_PASSWORD_REQUIRED"
  >("SIGN_IN");

  // Redirect destination after login
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/app";

  // If already authenticated, redirect (using Navigate, not navigate() during render)
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const remainingLockMs = getRemainingLockMs();
    if (remainingLockMs > 0) {
      setLockRemainingMs(remainingLockMs);
      setError(
        `Too many failed attempts. Try again in ${formatCooldown(remainingLockMs)}.`,
      );
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (challengeStep === "NEW_PASSWORD_REQUIRED") {
        // Complete the new password challenge
        const result = await confirmSignIn({ challengeResponse: newPassword });
        if (result.isSignedIn) {
          clearLoginGuardState();
          setLockRemainingMs(0);
          await refreshSession(); // Sync AuthContext state
          navigate(from, { replace: true });
        }
      } else {
        const result = await login(email.trim().toLowerCase(), password);

        if (result.isSignedIn) {
          clearLoginGuardState();
          setLockRemainingMs(0);
          navigate(from, { replace: true });
        } else if (
          result.nextStep?.signInStep ===
          "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
        ) {
          setChallengeStep("NEW_PASSWORD_REQUIRED");
        }
      }
    } catch {
      const lockUntil = recordFailedLogin();
      const cooldownMs = Math.max(0, lockUntil - Date.now());
      setLockRemainingMs(cooldownMs);
      setError(
        cooldownMs > 0
          ? `Too many failed attempts. Try again in ${formatCooldown(cooldownMs)}.`
          : "Sign in failed. Check your credentials and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = lockRemainingMs > 0;

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
                  disabled={isLocked || isSubmitting}
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
                  disabled={isLocked || isSubmitting}
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
                disabled={isLocked || isSubmitting}
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

          {isLocked && (
            <p className="text-amber-700 text-sm bg-amber-50 rounded-lg p-2.5">
              Sign-in is temporarily paused for {formatCooldown(lockRemainingMs)}.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isLocked}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl py-2.5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLocked
              ? "Please Wait"
              : challengeStep === "NEW_PASSWORD_REQUIRED"
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
