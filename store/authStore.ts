/**
 * WHY ZUSTAND?
 * - Minimal boilerplate: no actions/reducers/dispatch ceremony like Redux
 * - Built-in async support: just write async functions in the store
 * - Small bundle footprint (~1KB gzipped vs Redux ~7KB)
 * - No Provider wrapping needed — stores are module-level singletons
 * - Perfect for small-medium apps like this dashboard
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser, token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      clearUser: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
