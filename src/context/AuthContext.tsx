// ============================================================
// AUTH CONTEXT - Cognito authentication state management
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  type SignInOutput,
} from "aws-amplify/auth";
import { CONFIG } from "../config";

export interface AuthUser {
  username: string;
  email: string;
  groups: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<SignInOutput>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function resolveAuthUser(): Promise<AuthUser | null> {
  try {
    const currentUser = await getCurrentUser();
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    const groups = (idToken?.payload?.["cognito:groups"] as string[]) ?? [];
    const email =
      (idToken?.payload?.email as string) ??
      currentUser.signInDetails?.loginId ??
      "";

    return {
      username: currentUser.username,
      email,
      groups,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const resolved = await resolveAuthUser();
    setUser(resolved);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    resolveAuthUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn({ username: email, password });
    if (result.isSignedIn) {
      const resolved = await resolveAuthUser();
      setUser(resolved);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.groups.includes(CONFIG.adminGroupName) ?? false,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
