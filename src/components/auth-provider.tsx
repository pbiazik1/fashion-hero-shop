"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";
import { createLocalStorageStore } from "@/lib/local-storage-store";

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const userStore = createLocalStorageStore<User | null>("stepforward_user", null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
    userStore.getServerSnapshot
  );

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login — always succeeds
    userStore.set({
      email,
      firstName: email.split("@")[0],
      lastName: "",
    });
  }, []);

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    userStore.set({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }, []);

  const logout = useCallback(() => {
    userStore.set(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
