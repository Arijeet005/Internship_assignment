/**
 * CACHING STRATEGY:
 * We cache API responses in Zustand state keyed by query params (page, search term).
 * WHY: Avoids redundant network calls when users navigate back or re-visit the same page.
 * WHAT: Cache key = `${search}-${page}` stores { data, total, timestamp }.
 * EXPIRY: Cache entries expire after 5 minutes to balance freshness vs performance.
 */

import { create } from "zustand";
import { User, PaginatedResponse } from "@/types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: User[];
  total: number;
  timestamp: number;
}

interface UsersState {
  users: User[];
  total: number;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  cache: Record<string, CacheEntry>;

  fetchUsers: (params: { limit: number; skip: number; search?: string }) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  clearCurrentUser: () => void;
}

const isCacheValid = (entry: CacheEntry) =>
  Date.now() - entry.timestamp < CACHE_TTL_MS;

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  currentUser: null,
  loading: false,
  error: null,
  cache: {},

  fetchUsers: async ({ limit, skip, search = "" }) => {
    const cacheKey = `${search}-${skip}`;
    const cached = get().cache[cacheKey];

    // Return cached result if still valid
    if (cached && isCacheValid(cached)) {
      set({ users: cached.data, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const url = search
        ? `https://dummyjson.com/users/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch users");

      const json = await res.json();
      const entry: CacheEntry = {
        data: json.users,
        total: json.total,
        timestamp: Date.now(),
      };

      set((state) => ({
        users: json.users,
        total: json.total,
        loading: false,
        cache: { ...state.cache, [cacheKey]: entry },
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null, currentUser: null });
    try {
      const res = await fetch(`https://dummyjson.com/users/${id}`);
      if (!res.ok) throw new Error("User not found");
      const user: User = await res.json();
      set({ currentUser: user, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
}));
