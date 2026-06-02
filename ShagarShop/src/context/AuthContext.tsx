"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "shagar-user";

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  /** False until localStorage has been read — keeps SSR and first client render in sync. */
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(loadUser());
    setIsReady(true);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
      void password;
      if (!email.includes("@")) return false;
      const name = email.split("@")[0].replace(/\./g, " ");
      persist({
        id: crypto.randomUUID(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
      });
      return true;
    },
    [persist],
  );

  const signup = useCallback(async (name: string, email: string, password: string) => {
      void password;
      if (!name.trim() || !email.includes("@")) return false;
      persist({
        id: crypto.randomUUID(),
        name: name.trim(),
        email,
      });
      return true;
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ user, isReady, login, signup, logout }),
    [user, isReady, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
